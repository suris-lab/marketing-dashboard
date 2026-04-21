import type { LinkedInData } from "@/lib/types";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

export function mockLinkedIn(startDate: string, endDate: string): LinkedInData {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;

  const rand = seededRandom(77);
  const ri = (a: number, b: number) => Math.floor(rand() * (b - a + 1)) + a;
  const rf = (a: number, b: number) => rand() * (b - a) + a;

  const daily = Array.from({ length: days }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const impressions = ri(200, 2000);
    const clicks = ri(5, 80);
    const spend = Math.round(rf(5, 60) * 100) / 100;
    return {
      date: d.toISOString().slice(0, 10),
      impressions,
      clicks,
      engagement: ri(10, 200),
      spend,
    };
  });

  const totalImp = daily.reduce((s, d) => s + (d.impressions ?? 0), 0);
  const totalClicks = daily.reduce((s, d) => s + (d.clicks ?? 0), 0);
  const totalSpend = Math.round(daily.reduce((s, d) => s + (d.spend ?? 0), 0) * 100) / 100;

  return {
    platform: "linkedin",
    is_mock: true,
    summary: {
      impressions: totalImp,
      clicks: totalClicks,
      engagement: daily.reduce((s, d) => s + (d.engagement ?? 0), 0),
      spend: totalSpend,
      ctr: Math.round((totalClicks / Math.max(totalImp, 1)) * 100 * 100) / 100,
      cpc: Math.round((totalSpend / Math.max(totalClicks, 1)) * 100) / 100,
      leads: ri(5, 40),
      followers: ri(200, 1200),
    },
    daily,
  };
}
