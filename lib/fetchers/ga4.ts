import type { WebsiteData, WebsitePropertyData, DailyRow } from "@/lib/types";
import { mockGa4 } from "@/lib/mock/ga4";

const GA4_PROPERTIES: Record<string, string> = {
  GA4_PROPERTY_ID_HHYC: "HHYC Official",
  GA4_PROPERTY_ID_24HOUR: "HHYC 24 Hour",
  GA4_PROPERTY_ID_STC: "Steering The Course",
};

function getCredentials(): object | null {
  const b64 = process.env.GOOGLE_CREDENTIALS_JSON;
  if (!b64) return null;
  try {
    return JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
  } catch {
    return null;
  }
}

async function fetchProperty(
  propertyId: string,
  label: string,
  startDate: string,
  endDate: string,
  credentials: object
): Promise<WebsitePropertyData> {
  const { BetaAnalyticsDataClient } = await import("@google-analytics/data");
  const client = new BetaAnalyticsDataClient({ credentials });

  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dimensions: [{ name: "date" }],
    metrics: [
      { name: "sessions" },
      { name: "totalUsers" },
      { name: "newUsers" },
      { name: "bounceRate" },
      { name: "averageSessionDuration" },
      { name: "conversions" },
    ],
    dateRanges: [{ startDate, endDate }],
  });

  const daily: DailyRow[] = (response.rows ?? []).map((row) => ({
    date: row.dimensionValues?.[0]?.value ?? "",
    sessions: parseInt(row.metricValues?.[0]?.value ?? "0"),
    users: parseInt(row.metricValues?.[1]?.value ?? "0"),
    new_users: parseInt(row.metricValues?.[2]?.value ?? "0"),
    bounce_rate: Math.round(parseFloat(row.metricValues?.[3]?.value ?? "0") * 100 * 10) / 10,
    avg_session_duration: Math.round(parseFloat(row.metricValues?.[4]?.value ?? "0")),
    conversions: parseInt(row.metricValues?.[5]?.value ?? "0"),
  }));

  const total_sessions = daily.reduce((s, d) => s + (d.sessions ?? 0), 0);
  const total_conversions = daily.reduce((s, d) => s + (d.conversions ?? 0), 0);
  const n = Math.max(daily.length, 1);

  return {
    platform: "website",
    label,
    is_mock: false,
    summary: {
      total_sessions,
      total_users: daily.reduce((s, d) => s + (d.users ?? 0), 0),
      new_users: daily.reduce((s, d) => s + (d.new_users ?? 0), 0),
      avg_bounce_rate: Math.round(daily.reduce((s, d) => s + (d.bounce_rate ?? 0), 0) / n * 10) / 10,
      avg_session_duration: Math.round(daily.reduce((s, d) => s + (d.avg_session_duration ?? 0), 0) / n),
      total_conversions,
      conversion_rate: Math.round(total_conversions / Math.max(total_sessions, 1) * 100 * 100) / 100,
    },
    daily,
  };
}

export async function fetchGa4(startDate: string, endDate: string): Promise<WebsiteData> {
  const credentials = getCredentials();
  const results: Record<string, WebsitePropertyData> = {};

  for (const [envKey, label] of Object.entries(GA4_PROPERTIES)) {
    const propertyId = process.env[envKey];
    if (!propertyId || !credentials) {
      const mock = mockGa4(startDate, endDate);
      results[envKey] = { ...mock.properties.GA4_PROPERTY_ID_HHYC, label };
    } else {
      try {
        results[envKey] = await fetchProperty(propertyId, label, startDate, endDate, credentials);
      } catch {
        const mock = mockGa4(startDate, endDate);
        results[envKey] = { ...mock.properties.GA4_PROPERTY_ID_HHYC, label, is_mock: true };
      }
    }
  }

  // Aggregate across all properties by date
  const allDaily: Record<string, DailyRow & { bounce_rates: number[] }> = {};
  for (const prop of Object.values(results)) {
    for (const d of prop.daily) {
      if (!allDaily[d.date]) {
        allDaily[d.date] = { date: d.date, sessions: 0, users: 0, new_users: 0, avg_session_duration: 0, conversions: 0, bounce_rates: [] };
      }
      allDaily[d.date].sessions! += d.sessions ?? 0;
      allDaily[d.date].users! += d.users ?? 0;
      allDaily[d.date].new_users! += d.new_users ?? 0;
      allDaily[d.date].avg_session_duration! += d.avg_session_duration ?? 0;
      allDaily[d.date].conversions! += d.conversions ?? 0;
      if (d.bounce_rate != null) allDaily[d.date].bounce_rates.push(d.bounce_rate);
    }
  }

  const propCount = Object.keys(results).length || 1;
  const daily: DailyRow[] = Object.values(allDaily)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(({ bounce_rates, avg_session_duration, ...rest }) => ({
      ...rest,
      avg_session_duration: Math.round((avg_session_duration ?? 0) / propCount),
      bounce_rate: bounce_rates.length
        ? Math.round(bounce_rates.reduce((s, v) => s + v, 0) / bounce_rates.length * 10) / 10
        : 0,
    }));

  const total_sessions = daily.reduce((s, d) => s + (d.sessions ?? 0), 0);
  const total_conversions = daily.reduce((s, d) => s + (d.conversions ?? 0), 0);
  const n = Math.max(daily.length, 1);
  const allMock = Object.values(results).every((p) => p.is_mock);

  const firstWithSources = Object.values(results).find((p) => p.traffic_sources?.length);
  const traffic_sources = firstWithSources?.traffic_sources ?? [];

  return {
    platform: "website",
    is_mock: allMock,
    properties: results,
    summary: {
      total_sessions,
      total_users: daily.reduce((s, d) => s + (d.users ?? 0), 0),
      new_users: daily.reduce((s, d) => s + (d.new_users ?? 0), 0),
      avg_bounce_rate: Math.round(daily.reduce((s, d) => s + (d.bounce_rate ?? 0), 0) / n * 10) / 10,
      avg_session_duration: Math.round(daily.reduce((s, d) => s + (d.avg_session_duration ?? 0), 0) / n),
      total_conversions,
      conversion_rate: Math.round(total_conversions / Math.max(total_sessions, 1) * 100 * 100) / 100,
      leads: Math.floor(total_conversions * 0.7),
    },
    daily,
    traffic_sources,
  };
}
