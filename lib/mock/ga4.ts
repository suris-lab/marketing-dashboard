import type { WebsiteData } from "@/lib/types";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

export function mockGa4(startDate: string, endDate: string): WebsiteData {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days =
    Math.round((end.getTime() - start.getTime()) / 86400000) + 1;

  const rand = seededRandom(45);
  const ri = (a: number, b: number) =>
    Math.floor(rand() * (b - a + 1)) + a;
  const rf = (a: number, b: number) => rand() * (b - a) + a;

  const daily = Array.from({ length: days }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const sessions = ri(200, 900);
    const users = Math.floor(sessions * rf(0.7, 0.9));
    return {
      date: d.toISOString().slice(0, 10),
      sessions,
      users,
      new_users: Math.floor(users * rf(0.3, 0.6)),
      bounce_rate: Math.round(rf(35.0, 65.0) * 10) / 10,
      avg_session_duration: Math.round(rf(90, 280)),
      conversions: ri(2, 25),
    };
  });

  const total_sessions = daily.reduce((s, d) => s + (d.sessions ?? 0), 0);
  const total_conversions = daily.reduce((s, d) => s + (d.conversions ?? 0), 0);

  const traffic_sources = [
    { source: "Organic Search", sessions: Math.floor(total_sessions * 0.38), color: "#10b981" },
    { source: "Direct",         sessions: Math.floor(total_sessions * 0.22), color: "#6366f1" },
    { source: "Social",         sessions: Math.floor(total_sessions * 0.20), color: "#f59e0b" },
    { source: "Referral",       sessions: Math.floor(total_sessions * 0.12), color: "#ec4899" },
    { source: "Email",          sessions: Math.floor(total_sessions * 0.08), color: "#14b8a6" },
  ];

  const summary = {
    total_sessions,
    total_users: daily.reduce((s, d) => s + (d.users ?? 0), 0),
    new_users: daily.reduce((s, d) => s + (d.new_users ?? 0), 0),
    avg_bounce_rate:
      Math.round((daily.reduce((s, d) => s + (d.bounce_rate ?? 0), 0) / Math.max(days, 1)) * 10) / 10,
    avg_session_duration:
      Math.round(daily.reduce((s, d) => s + (d.avg_session_duration ?? 0), 0) / Math.max(days, 1)),
    total_conversions,
    conversion_rate: Math.round((total_conversions / Math.max(total_sessions, 1)) * 100 * 100) / 100,
    leads: Math.floor(total_conversions * 0.7),
    cpl: Math.round(rf(5.0, 18.0) * 100) / 100,
    cpa: Math.round(rf(15.0, 45.0) * 100) / 100,
  };

  const prop = {
    platform: "website" as const,
    label: "HHYC Official",
    is_mock: true,
    summary,
    daily,
    traffic_sources,
  };

  return {
    platform: "website",
    is_mock: true,
    properties: { GA4_PROPERTY_ID_HHYC: prop },
    summary,
    daily,
    traffic_sources,
  };
}
