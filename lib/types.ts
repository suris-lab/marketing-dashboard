export interface DailyRow {
  date: string;
  sessions?: number;
  users?: number;
  new_users?: number;
  bounce_rate?: number;
  avg_session_duration?: number;
  conversions?: number;
  impressions?: number;
  reach?: number;
  engagement?: number;
  clicks?: number;
  spend?: number;
}

export interface TrafficSource {
  source: string;
  sessions: number;
  color: string;
}

// ─── Website / GA4 ────────────────────────────────────────────────────────────

export interface WebsiteSummary {
  total_sessions: number;
  total_users: number;
  new_users: number;
  avg_bounce_rate: number;
  avg_session_duration: number;
  total_conversions: number;
  conversion_rate: number;
  leads?: number;
  cpl?: number;
  cpa?: number;
}

export interface WebsitePropertyData {
  platform: "website";
  label: string;
  is_mock: boolean;
  summary: WebsiteSummary;
  daily: DailyRow[];
  traffic_sources?: TrafficSource[];
}

export interface WebsiteData {
  platform: "website";
  is_mock: boolean;
  properties: Record<string, WebsitePropertyData>;
  summary: WebsiteSummary;
  daily: DailyRow[];
  traffic_sources: TrafficSource[];
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

export interface MetaPlatformSummary {
  impressions: number;
  reach: number;
  engagement: number;
  clicks: number;
  spend: number;
  ctr: number;
  cpc: number;
  cpm: number;
  leads: number;
  roas?: number;
  followers?: number;
  profile_views?: number;
}

export interface MetaData {
  platform: "meta";
  is_mock: boolean;
  summary: {
    facebook: MetaPlatformSummary;
    instagram: MetaPlatformSummary;
  };
  daily: {
    facebook: DailyRow[];
    instagram: DailyRow[];
  };
}

// ─── LinkedIn ─────────────────────────────────────────────────────────────────

export interface LinkedInSummary {
  impressions: number;
  clicks: number;
  engagement: number;
  spend: number;
  ctr: number;
  cpc: number;
  leads: number;
  followers?: number;
}

export interface LinkedInData {
  platform: "linkedin";
  is_mock: boolean;
  summary: LinkedInSummary;
  daily: DailyRow[];
}

// ─── EDM / Mailchimp ──────────────────────────────────────────────────────────

export interface Campaign {
  id: string;
  title: string;
  subject: string;
  send_time: string;
  emails_sent: number;
  unique_opens: number;
  unique_clicks: number;
  open_rate: number;
  click_rate: number;
  ctor: number;
  unsubscribes: number;
  category: "weekly" | "member_notice" | "standalone";
}

export interface CategorySummary {
  count: number;
  total_sent: number;
  avg_open_rate: number;
  avg_click_rate: number;
  avg_ctor: number;
}

export interface EdmSummary {
  total_campaigns: number;
  total_sent: number;
  avg_open_rate: number;
  avg_click_rate: number;
  avg_ctor: number;
  leads: number;
}

export interface EdmData {
  platform: "edm";
  is_mock: boolean;
  summary: EdmSummary;
  campaigns: Campaign[];
  categories: {
    weekly: CategorySummary;
    member_notice: CategorySummary;
    standalone: CategorySummary;
  };
}

// ─── Overview ─────────────────────────────────────────────────────────────────

export interface OverviewData {
  total_impressions: number;
  total_reach: number;
  total_engagement: number;
  total_spend: number;
  total_leads: number;
  overall_cpl: number;
  website_sessions: number;
  website_conversions: number;
  edm_open_rate: number;
  date_range: { start: string; end: string };
}

// ─── Full metrics response ────────────────────────────────────────────────────

export interface MetricsResponse {
  meta?: MetaData;
  linkedin?: LinkedInData;
  edm?: EdmData;
  website?: WebsiteData;
  overview?: OverviewData;
}

// ─── Assets ───────────────────────────────────────────────────────────────────

export interface Asset {
  id: string;
  name: string;
  platform: string;
  type: string;
  url: string;
  added_date: string;
}
