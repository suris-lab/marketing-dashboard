import { KpiCard } from "@/components/ui/KpiCard";
import type { OverviewData } from "@/lib/types";

function fmt(n: number, prefix = "") {
  if (n >= 1_000_000) return `${prefix}${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${prefix}${(n / 1_000).toFixed(1)}K`;
  return `${prefix}${n.toLocaleString()}`;
}

interface Props {
  data: OverviewData;
}

export function OverviewCards({ data }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
      <KpiCard label="Total Impressions" value={fmt(data.total_impressions)} accent="blue" />
      <KpiCard label="Total Reach"       value={fmt(data.total_reach)}       accent="purple" />
      <KpiCard label="Engagement"        value={fmt(data.total_engagement)}   accent="teal" />
      <KpiCard label="Ad Spend"          value={fmt(data.total_spend, "$")}  accent="pink" />
      <KpiCard label="Total Leads"       value={fmt(data.total_leads)}       accent="green" />
      <KpiCard label="Avg CPL"           value={`$${data.overall_cpl.toFixed(2)}`} accent="amber" />
    </div>
  );
}
