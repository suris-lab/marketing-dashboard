import { SectionHeader } from "@/components/ui/SectionHeader";
import { OverviewCards } from "./OverviewCards";
import type { OverviewData } from "@/lib/types";

interface Props {
  data: OverviewData;
}

export function OverviewSection({ data }: Props) {
  return (
    <div>
      <SectionHeader title="Campaign Overview" subtitle={`${data.date_range.start} → ${data.date_range.end}`} />
      <OverviewCards data={data} />

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <p className="text-xs uppercase tracking-wider text-gray-400">Website Sessions</p>
          <p className="mt-2 text-2xl font-bold text-blue-400">{data.website_sessions.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <p className="text-xs uppercase tracking-wider text-gray-400">Website Conversions</p>
          <p className="mt-2 text-2xl font-bold text-emerald-400">{data.website_conversions.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <p className="text-xs uppercase tracking-wider text-gray-400">EDM Avg Open Rate</p>
          <p className="mt-2 text-2xl font-bold text-amber-400">{data.edm_open_rate}%</p>
        </div>
      </div>
    </div>
  );
}
