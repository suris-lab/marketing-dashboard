import type { EdmData, Campaign } from "@/lib/types";
import { mockMailchimp } from "@/lib/mock/mailchimp";

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

export async function fetchMailchimp(startDate: string, endDate: string): Promise<EdmData> {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

  if (!apiKey || !serverPrefix) return mockMailchimp(startDate, endDate);

  try {
    const mailchimp = (await import("@mailchimp/mailchimp_marketing")).default;
    mailchimp.setConfig({ apiKey, server: serverPrefix });

    const sinceTime = `${startDate}T00:00:00+00:00`;
    const beforeTime = `${endDate}T23:59:59+00:00`;

    const listRes = await mailchimp.campaigns.list({
      status: "sent",
      since_send_time: sinceTime,
      before_send_time: beforeTime,
      count: 100,
      fields: ["campaigns.id", "campaigns.settings.title", "campaigns.settings.subject_line", "campaigns.send_time", "campaigns.recipients"],
    }) as { campaigns: { id: string; settings: { title: string; subject_line: string }; send_time: string; recipients: { recipient_count: number } }[] };

    const campaigns: Campaign[] = await Promise.all(
      (listRes.campaigns ?? []).map(async (c) => {
        let report: { opens?: { unique_opens?: number }; clicks?: { unique_clicks?: number }; unsubscribed?: number } = {};
        try {
          report = await mailchimp.reports.getCampaignReport(c.id) as typeof report;
        } catch { /* report may not exist yet */ }

        const emails_sent = c.recipients?.recipient_count ?? 0;
        const unique_opens = report.opens?.unique_opens ?? 0;
        const unique_clicks = report.clicks?.unique_clicks ?? 0;
        const open_rate = Math.round(unique_opens / Math.max(emails_sent, 1) * 100 * 10) / 10;
        const click_rate = Math.round(unique_clicks / Math.max(emails_sent, 1) * 100 * 10) / 10;
        const ctor = Math.round(unique_clicks / Math.max(unique_opens, 1) * 100 * 10) / 10;

        return {
          id: c.id,
          title: c.settings.title,
          subject: c.settings.subject_line,
          send_time: c.send_time,
          emails_sent,
          unique_opens,
          unique_clicks,
          open_rate,
          click_rate,
          ctor,
          unsubscribes: report.unsubscribed ?? 0,
          category: categorize(c.settings.title),
        };
      })
    );

    const weekly = campaigns.filter((c) => c.category === "weekly");
    const member_notice = campaigns.filter((c) => c.category === "member_notice");
    const standalone = campaigns.filter((c) => c.category === "standalone");

    const count = campaigns.length;
    const total_sent = campaigns.reduce((s, c) => s + c.emails_sent, 0);

    return {
      platform: "edm",
      is_mock: false,
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
  } catch {
    return mockMailchimp(startDate, endDate);
  }
}
