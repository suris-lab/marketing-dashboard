import { SectionHeader } from "@/components/ui/SectionHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { WebsiteCharts } from "./WebsiteCharts";
import type { WebsiteData } from "@/lib/types";

interface Props {
  data: WebsiteData;
}

export function WebsiteSection({ data }: Props) {
  const s = data.summary;

  function fmtDuration(sec: number) {
    const m = Math.floor(sec / 60);
    const s2 = Math.round(sec % 60);
    return `${m}m ${s2}s`;
  }

  return (
    <div>
      <SectionHeader title="Website Analytics" subtitle="Google Analytics 4 — all properties combined" isMock={data.is_mock} />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard label="Sessions"     value={s.total_sessions.toLocaleString()}    accent="blue" />
        <KpiCard label="Users"        value={s.total_users.toLocaleString()}       accent="purple" />
        <KpiCard label="New Users"    value={s.new_users.toLocaleString()}         accent="teal" />
        <KpiCard label="Bounce Rate"  value={`${s.avg_bounce_rate}%`}             accent="pink" />
        <KpiCard label="Avg Duration" value={fmtDuration(s.avg_session_duration)} accent="amber" />
        <KpiCard label="Conversions"  value={s.total_conversions.toLocaleString()} accent="green" />
        <KpiCard label="Conv. Rate"   value={`${s.conversion_rate}%`}             accent="green" />
        {s.leads != null && <KpiCard label="Est. Leads" value={s.leads.toLocaleString()} accent="teal" />}
      </div>

      <WebsiteCharts daily={data.daily} trafficSources={data.traffic_sources} />
    </div>
  );
}
