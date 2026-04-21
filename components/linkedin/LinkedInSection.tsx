import { SectionHeader } from "@/components/ui/SectionHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { LinkedInCharts } from "./LinkedInCharts";
import type { LinkedInData } from "@/lib/types";

interface Props {
  data: LinkedInData;
}

export function LinkedInSection({ data }: Props) {
  const s = data.summary;
  return (
    <div>
      <SectionHeader title="LinkedIn" subtitle="Organic & paid analytics" isMock={data.is_mock} />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard label="Impressions" value={s.impressions.toLocaleString()} accent="blue" />
        <KpiCard label="Clicks"      value={s.clicks.toLocaleString()}      accent="green" />
        <KpiCard label="Engagement"  value={s.engagement.toLocaleString()}  accent="teal" />
        <KpiCard label="CTR"         value={`${s.ctr}%`}                    accent="amber" />
        {s.spend > 0 && <KpiCard label="Ad Spend" value={`$${s.spend.toFixed(2)}`} accent="pink" />}
        {s.followers && <KpiCard label="Followers" value={s.followers.toLocaleString()} accent="purple" />}
        <KpiCard label="Leads" value={s.leads.toLocaleString()} accent="green" />
      </div>

      <LinkedInCharts daily={data.daily} />
    </div>
  );
}
