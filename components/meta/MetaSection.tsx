"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { MetaCharts } from "./MetaCharts";
import type { MetaData } from "@/lib/types";

type Platform = "facebook" | "instagram";

interface Props {
  data: MetaData;
}

export function MetaSection({ data }: Props) {
  const [platform, setPlatform] = useState<Platform>("facebook");
  const s = data.summary[platform];

  const tabs: { id: Platform; label: string }[] = [
    { id: "facebook",  label: "Facebook" },
    { id: "instagram", label: "Instagram" },
  ];

  return (
    <div>
      <SectionHeader title="Meta" subtitle="Facebook & Instagram analytics" isMock={data.is_mock} />

      <div className="mb-5 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setPlatform(t.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              platform === t.id
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Impressions" value={s.impressions.toLocaleString()} accent="blue" />
        <KpiCard label="Reach"       value={s.reach.toLocaleString()}       accent="purple" />
        <KpiCard label="Engagement"  value={s.engagement.toLocaleString()}  accent="teal" />
        <KpiCard label="Ad Spend"    value={`$${s.spend.toFixed(2)}`}       accent="pink" />
        <KpiCard label="Clicks"      value={s.clicks.toLocaleString()}      accent="green" />
        <KpiCard label="CTR"         value={`${s.ctr}%`}                    accent="amber" />
        <KpiCard label="CPC"         value={`$${s.cpc.toFixed(2)}`}         accent="amber" />
        <KpiCard label="Leads"       value={s.leads.toLocaleString()}       accent="green" />
      </div>

      <MetaCharts daily={data.daily[platform]} platform={platform} />
    </div>
  );
}
