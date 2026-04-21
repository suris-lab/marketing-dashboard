import type { MetaData } from "@/lib/types";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

export function mockMeta(startDate: string, endDate: string): MetaData {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;

  const rand = seededRandom(99);
  const ri = (a: number, b: number) => Math.floor(rand() * (b - a + 1)) + a;
  const rf = (a: number, b: number) => rand() * (b - a) + a;

  const fbDaily = Array.from({ length: days }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const impressions = ri(1000, 8000);
    const reach = Math.floor(impressions * rf(0.5, 0.8));
    const clicks = ri(20, 300);
    const spend = Math.round(rf(10, 80) * 100) / 100;
    return {
      date: d.toISOString().slice(0, 10),
      impressions,
      reach,
      engagement: ri(50, 600),
      clicks,
      spend,
    };
  });

  const igDaily = Array.from({ length: days }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const impressions = ri(800, 5000);
    const reach = Math.floor(impressions * rf(0.5, 0.8));
    const clicks = ri(10, 150);
    const spend = Math.round(rf(5, 50) * 100) / 100;
    return {
      date: d.toISOString().slice(0, 10),
      impressions,
      reach,
      engagement: ri(100, 900),
      clicks,
      spend,
    };
  });

  const fbImp = fbDaily.reduce((s, d) => s + (d.impressions ?? 0), 0);
  const fbClicks = fbDaily.reduce((s, d) => s + (d.clicks ?? 0), 0);
  const fbSpend = Math.round(fbDaily.reduce((s, d) => s + (d.spend ?? 0), 0) * 100) / 100;
  const igImp = igDaily.reduce((s, d) => s + (d.impressions ?? 0), 0);
  const igClicks = igDaily.reduce((s, d) => s + (d.clicks ?? 0), 0);
  const igSpend = Math.round(igDaily.reduce((s, d) => s + (d.spend ?? 0), 0) * 100) / 100;

  return {
    platform: "meta",
    is_mock: true,
    summary: {
      facebook: {
        impressions: fbImp,
        reach: fbDaily.reduce((s, d) => s + (d.reach ?? 0), 0),
        engagement: fbDaily.reduce((s, d) => s + (d.engagement ?? 0), 0),
        clicks: fbClicks,
        spend: fbSpend,
        ctr: Math.round((fbClicks / Math.max(fbImp, 1)) * 100 * 100) / 100,
        cpc: Math.round((fbSpend / Math.max(fbClicks, 1)) * 100) / 100,
        cpm: Math.round((fbSpend / Math.max(fbImp, 1)) * 1000 * 100) / 100,
        leads: ri(20, 120),
        roas: Math.round(rf(1.5, 4.5) * 100) / 100,
        followers: ri(500, 3000),
      },
      instagram: {
        impressions: igImp,
        reach: igDaily.reduce((s, d) => s + (d.reach ?? 0), 0),
        engagement: igDaily.reduce((s, d) => s + (d.engagement ?? 0), 0),
        clicks: igClicks,
        spend: igSpend,
        ctr: Math.round((igClicks / Math.max(igImp, 1)) * 100 * 100) / 100,
        cpc: Math.round((igSpend / Math.max(igClicks, 1)) * 100) / 100,
        cpm: Math.round((igSpend / Math.max(igImp, 1)) * 1000 * 100) / 100,
        leads: ri(10, 80),
        followers: ri(800, 5000),
        profile_views: ri(200, 1500),
      },
    },
    daily: { facebook: fbDaily, instagram: igDaily },
  };
}
