import type { LinkedInData, DailyRow } from "@/lib/types";
import { mockLinkedIn } from "@/lib/mock/linkedin";

export async function fetchLinkedIn(startDate: string, endDate: string): Promise<LinkedInData> {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  const orgId = process.env.LINKEDIN_ORG_ID;

  if (!token || !orgId) return mockLinkedIn(startDate, endDate);

  try {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    const qs = new URLSearchParams({
      q: "organizationalEntity",
      organizationalEntity: `urn:li:organization:${orgId}`,
      timeIntervals: `(timeRange:(start:${start},end:${end}),timeGranularityType:DAY)`,
      fields: "totalShareStatistics,dateRange",
    });

    const res = await fetch(
      `https://api.linkedin.com/v2/organizationalEntityShareStatistics?${qs}`,
      { headers: { Authorization: `Bearer ${token}`, "X-Restli-Protocol-Version": "2.0.0" } }
    );

    if (!res.ok) throw new Error(`LinkedIn API: ${res.status}`);
    const json = await res.json() as {
      elements: {
        dateRange: { start: { month: number; day: number; year: number } };
        totalShareStatistics: {
          impressionCount: number;
          clickCount: number;
          engagement: number;
          shareCount: number;
        };
      }[];
    };

    const daily: DailyRow[] = (json.elements ?? []).map((el) => {
      const { year, month, day } = el.dateRange.start;
      const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      return {
        date,
        impressions: el.totalShareStatistics.impressionCount ?? 0,
        clicks: el.totalShareStatistics.clickCount ?? 0,
        engagement: el.totalShareStatistics.engagement ?? 0,
        spend: 0,
      };
    });

    const totalImp = daily.reduce((s, d) => s + (d.impressions ?? 0), 0);
    const totalClicks = daily.reduce((s, d) => s + (d.clicks ?? 0), 0);

    return {
      platform: "linkedin",
      is_mock: false,
      summary: {
        impressions: totalImp,
        clicks: totalClicks,
        engagement: daily.reduce((s, d) => s + (d.engagement ?? 0), 0),
        spend: 0,
        ctr: Math.round(totalClicks / Math.max(totalImp, 1) * 100 * 100) / 100,
        cpc: 0,
        leads: 0,
      },
      daily,
    };
  } catch {
    return mockLinkedIn(startDate, endDate);
  }
}
