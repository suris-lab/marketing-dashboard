import type { MetaData, DailyRow } from "@/lib/types";
import { mockMeta } from "@/lib/mock/meta";

const GRAPH = "https://graph.facebook.com/v19.0";

async function gql(path: string, params: Record<string, string>): Promise<unknown> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${GRAPH}/${path}?${qs}`);
  if (!res.ok) throw new Error(`Meta API error: ${res.status}`);
  return res.json();
}

export async function fetchMeta(startDate: string, endDate: string): Promise<MetaData> {
  const fbToken = process.env.FB_ACCESS_TOKEN;
  const igToken = process.env.IG_ACCESS_TOKEN;
  const fbPageId = process.env.FB_PAGE_ID;
  const fbAdAccount = process.env.FB_AD_ACCOUNT_ID;
  const igAccountId = process.env.IG_BUSINESS_ACCOUNT_ID;

  if (!fbToken || !igToken) return mockMeta(startDate, endDate);

  try {
    // Facebook Page Insights — daily
    const fbInsights = await gql(`${fbPageId}/insights`, {
      metric: "page_impressions,page_reach,page_engaged_users",
      period: "day",
      since: startDate,
      until: endDate,
      access_token: fbToken,
    }) as { data: { name: string; values: { value: number; end_time: string }[] }[] };

    const fbDailyMap: Record<string, DailyRow> = {};
    for (const metric of fbInsights.data ?? []) {
      for (const v of metric.values) {
        const date = v.end_time.slice(0, 10);
        if (!fbDailyMap[date]) fbDailyMap[date] = { date };
        if (metric.name === "page_impressions") fbDailyMap[date].impressions = v.value;
        if (metric.name === "page_reach") fbDailyMap[date].reach = v.value;
        if (metric.name === "page_engaged_users") fbDailyMap[date].engagement = v.value;
      }
    }

    // Facebook Ad Account Insights — spend + clicks
    if (fbAdAccount) {
      const adInsights = await gql(`act_${fbAdAccount}/insights`, {
        fields: "date_start,impressions,clicks,spend",
        time_increment: "1",
        time_range: JSON.stringify({ since: startDate, until: endDate }),
        access_token: fbToken,
      }) as { data: { date_start: string; impressions: string; clicks: string; spend: string }[] };

      for (const row of adInsights.data ?? []) {
        const date = row.date_start;
        if (!fbDailyMap[date]) fbDailyMap[date] = { date };
        fbDailyMap[date].clicks = parseInt(row.clicks ?? "0");
        fbDailyMap[date].spend = parseFloat(row.spend ?? "0");
      }
    }

    // Instagram Insights
    const igInsights = await gql(`${igAccountId}/insights`, {
      metric: "impressions,reach,profile_views",
      period: "day",
      since: startDate,
      until: endDate,
      access_token: igToken,
    }) as { data: { name: string; values: { value: number; end_time: string }[] }[] };

    const igDailyMap: Record<string, DailyRow> = {};
    for (const metric of igInsights.data ?? []) {
      for (const v of metric.values) {
        const date = v.end_time.slice(0, 10);
        if (!igDailyMap[date]) igDailyMap[date] = { date };
        if (metric.name === "impressions") igDailyMap[date].impressions = v.value;
        if (metric.name === "reach") igDailyMap[date].reach = v.value;
      }
    }

    const fbDaily = Object.values(fbDailyMap).sort((a, b) => a.date.localeCompare(b.date));
    const igDaily = Object.values(igDailyMap).sort((a, b) => a.date.localeCompare(b.date));

    const fbImp = fbDaily.reduce((s, d) => s + (d.impressions ?? 0), 0);
    const fbClicks = fbDaily.reduce((s, d) => s + (d.clicks ?? 0), 0);
    const fbSpend = Math.round(fbDaily.reduce((s, d) => s + (d.spend ?? 0), 0) * 100) / 100;
    const igImp = igDaily.reduce((s, d) => s + (d.impressions ?? 0), 0);
    const igClicks = igDaily.reduce((s, d) => s + (d.clicks ?? 0), 0);
    const igSpend = Math.round(igDaily.reduce((s, d) => s + (d.spend ?? 0), 0) * 100) / 100;

    return {
      platform: "meta",
      is_mock: false,
      summary: {
        facebook: {
          impressions: fbImp,
          reach: fbDaily.reduce((s, d) => s + (d.reach ?? 0), 0),
          engagement: fbDaily.reduce((s, d) => s + (d.engagement ?? 0), 0),
          clicks: fbClicks,
          spend: fbSpend,
          ctr: Math.round(fbClicks / Math.max(fbImp, 1) * 100 * 100) / 100,
          cpc: Math.round(fbSpend / Math.max(fbClicks, 1) * 100) / 100,
          cpm: Math.round(fbSpend / Math.max(fbImp, 1) * 1000 * 100) / 100,
          leads: 0,
        },
        instagram: {
          impressions: igImp,
          reach: igDaily.reduce((s, d) => s + (d.reach ?? 0), 0),
          engagement: igDaily.reduce((s, d) => s + (d.engagement ?? 0), 0),
          clicks: igClicks,
          spend: igSpend,
          ctr: Math.round(igClicks / Math.max(igImp, 1) * 100 * 100) / 100,
          cpc: Math.round(igSpend / Math.max(igClicks, 1) * 100) / 100,
          cpm: Math.round(igSpend / Math.max(igImp, 1) * 1000 * 100) / 100,
          leads: 0,
        },
      },
      daily: { facebook: fbDaily, instagram: igDaily },
    };
  } catch {
    return mockMeta(startDate, endDate);
  }
}
