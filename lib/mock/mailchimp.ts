import type { EdmData, Campaign } from "@/lib/types";

const MOCK_CAMPAIGNS: Omit<Campaign, "category">[] = [
  { id: "m1", title: "HHYC Weekly What's On | Apr 14", subject: "This Week at HHYC — Races, Socials & More", send_time: "2024-04-14T08:00:00", emails_sent: 1420, unique_opens: 682, unique_clicks: 94, open_rate: 48.0, click_rate: 6.6, ctor: 13.8, unsubscribes: 2 },
  { id: "m2", title: "Member Notice - AGM 2024",        subject: "Important: Annual General Meeting Notice",    send_time: "2024-04-10T09:00:00", emails_sent: 1380, unique_opens: 910, unique_clicks: 210, open_rate: 65.9, click_rate: 15.2, ctor: 23.1, unsubscribes: 0 },
  { id: "m3", title: "HHYC Weekly What's On | Apr 7",  subject: "April Events — Don't Miss Out!",             send_time: "2024-04-07T08:00:00", emails_sent: 1415, unique_opens: 650, unique_clicks: 88, open_rate: 45.9, click_rate: 6.2, ctor: 13.5, unsubscribes: 3 },
  { id: "m4", title: "Corporate Sponsorship Package",   subject: "Exclusive Partnership Opportunities 2024",   send_time: "2024-04-05T10:00:00", emails_sent: 320,  unique_opens: 158, unique_clicks: 62, open_rate: 49.4, click_rate: 19.4, ctor: 39.2, unsubscribes: 1 },
  { id: "m5", title: "白沙灣遊艇會活動快訊 | Mar 31",       subject: "本週活動精選 — 賽事、社交及更多",                  send_time: "2024-03-31T08:00:00", emails_sent: 1390, unique_opens: 598, unique_clicks: 72, open_rate: 43.0, click_rate: 5.2, ctor: 12.0, unsubscribes: 1 },
  { id: "m6", title: "Member Notice - 會員通告 Rule Change", subject: "Important Club Rule Amendment",          send_time: "2024-03-28T09:30:00", emails_sent: 1375, unique_opens: 880, unique_clicks: 190, open_rate: 64.0, click_rate: 13.8, ctor: 21.6, unsubscribes: 0 },
];

function categorize(title: string): Campaign["category"] {
  const t = title.toLowerCase();
  if (t.includes("weekly what's on") || title.includes("活動快訊")) return "weekly";
  if (t.includes("member notice") || title.includes("會員通告")) return "member_notice";
  return "standalone";
}

function categorySummary(campaigns: Campaign[]) {
  const count = campaigns.length;
  if (count === 0) return { count: 0, total_sent: 0, avg_open_rate: 0, avg_click_rate: 0, avg_ctor: 0 };
  return {
    count,
    total_sent: campaigns.reduce((s, c) => s + c.emails_sent, 0),
    avg_open_rate: Math.round(campaigns.reduce((s, c) => s + c.open_rate, 0) / count * 10) / 10,
    avg_click_rate: Math.round(campaigns.reduce((s, c) => s + c.click_rate, 0) / count * 10) / 10,
    avg_ctor: Math.round(campaigns.reduce((s, c) => s + c.ctor, 0) / count * 10) / 10,
  };
}

export function mockMailchimp(startDate: string, endDate: string): EdmData {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const campaigns: Campaign[] = MOCK_CAMPAIGNS
    .filter(c => {
      const t = new Date(c.send_time);
      return t >= start && t <= end;
    })
    .map(c => ({ ...c, category: categorize(c.title) }));

  const weekly = campaigns.filter(c => c.category === "weekly");
  const member_notice = campaigns.filter(c => c.category === "member_notice");
  const standalone = campaigns.filter(c => c.category === "standalone");

  const count = campaigns.length;
  const total_sent = campaigns.reduce((s, c) => s + c.emails_sent, 0);

  return {
    platform: "edm",
    is_mock: true,
    summary: {
      total_campaigns: count,
      total_sent,
      avg_open_rate: count ? Math.round(campaigns.reduce((s, c) => s + c.open_rate, 0) / count * 10) / 10 : 0,
      avg_click_rate: count ? Math.round(campaigns.reduce((s, c) => s + c.click_rate, 0) / count * 10) / 10 : 0,
      avg_ctor: count ? Math.round(campaigns.reduce((s, c) => s + c.ctor, 0) / count * 10) / 10 : 0,
      leads: Math.floor(total_sent * 0.005),
    },
    campaigns,
    categories: {
      weekly: categorySummary(weekly),
      member_notice: categorySummary(member_notice),
      standalone: categorySummary(standalone),
    },
  };
}
