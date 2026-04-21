import { NextRequest, NextResponse } from "next/server";
import { fetchMeta } from "@/lib/fetchers/meta";
import { fetchLinkedIn } from "@/lib/fetchers/linkedin";
import { fetchMailchimp } from "@/lib/fetchers/mailchimp";
import { fetchGa4 } from "@/lib/fetchers/ga4";
import type { MetaPlatformSummary, LinkedInSummary, EdmSummary, WebsiteSummary } from "@/lib/types";

const EMPTY_META: MetaPlatformSummary = { impressions: 0, reach: 0, engagement: 0, clicks: 0, spend: 0, ctr: 0, cpc: 0, cpm: 0, leads: 0 };
const EMPTY_LI: LinkedInSummary = { impressions: 0, clicks: 0, engagement: 0, spend: 0, ctr: 0, cpc: 0, leads: 0 };
const EMPTY_EDM: EdmSummary = { total_campaigns: 0, total_sent: 0, avg_open_rate: 0, avg_click_rate: 0, avg_ctor: 0, leads: 0 };
const EMPTY_WEB: WebsiteSummary = { total_sessions: 0, total_users: 0, new_users: 0, avg_bounce_rate: 0, avg_session_duration: 0, total_conversions: 0, conversion_rate: 0 };

function defaultDates() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 29);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const defaults = defaultDates();
  const start = searchParams.get("start") || defaults.start;
  const end = searchParams.get("end") || defaults.end;
  const platform = searchParams.get("platform") || "all";

  const [metaData, linkedinData, edmData, websiteData] = await Promise.all([
    platform === "all" || ["facebook", "instagram", "meta"].includes(platform)
      ? fetchMeta(start, end)
      : Promise.resolve(undefined),
    platform === "all" || platform === "linkedin"
      ? fetchLinkedIn(start, end)
      : Promise.resolve(undefined),
    platform === "all" || ["edm", "mailchimp"].includes(platform)
      ? fetchMailchimp(start, end)
      : Promise.resolve(undefined),
    platform === "all" || ["website", "ga4"].includes(platform)
      ? fetchGa4(start, end)
      : Promise.resolve(undefined),
  ]);

  const result: Record<string, unknown> = {};
  if (metaData) result.meta = metaData;
  if (linkedinData) result.linkedin = linkedinData;
  if (edmData) result.edm = edmData;
  if (websiteData) result.website = websiteData;

  // Build overview summary
  const fb = metaData?.summary?.facebook ?? EMPTY_META;
  const ig = metaData?.summary?.instagram ?? EMPTY_META;
  const li = linkedinData?.summary ?? EMPTY_LI;
  const edm = edmData?.summary ?? EMPTY_EDM;
  const web = websiteData?.summary ?? EMPTY_WEB;

  const totalSpend =
    (fb.spend ?? 0) + (ig.spend ?? 0) + (li.spend ?? 0);
  const totalLeads =
    (fb.leads ?? 0) + (ig.leads ?? 0) + (li.leads ?? 0) +
    (edm.leads ?? 0) + (web.leads ?? 0);

  result.overview = {
    total_impressions: (fb.impressions ?? 0) + (ig.impressions ?? 0) + (li.impressions ?? 0),
    total_reach: (fb.reach ?? 0) + (ig.reach ?? 0),
    total_engagement: (fb.engagement ?? 0) + (ig.engagement ?? 0) + (li.engagement ?? 0),
    total_spend: totalSpend,
    total_leads: totalLeads,
    overall_cpl: Math.round(totalSpend / Math.max(totalLeads, 1) * 100) / 100,
    website_sessions: web.total_sessions ?? 0,
    website_conversions: web.total_conversions ?? 0,
    edm_open_rate: edm.avg_open_rate ?? 0,
    date_range: { start, end },
  };

  return NextResponse.json(result);
}
