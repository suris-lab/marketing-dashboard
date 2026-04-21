"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { EdmRatesChart } from "./EdmRatesChart";
import { EdmTable } from "./EdmTable";
import type { EdmData, Campaign } from "@/lib/types";

type Category = "all" | "weekly" | "member_notice" | "standalone";

const CAT_LABELS: Record<Category, string> = {
  all:           "All",
  weekly:        "Weekly What's On",
  member_notice: "Member Notice",
  standalone:    "Standalone EDM",
};

interface Props {
  data: EdmData;
}

export function EdmSection({ data }: Props) {
  const [category, setCategory] = useState<Category>("all");

  const filtered: Campaign[] =
    category === "all" ? data.campaigns : data.campaigns.filter((c) => c.category === category);

  const s = data.summary;
  const catData = category !== "all" ? data.categories[category] : null;

  return (
    <div>
      <SectionHeader title="EDM / Email Campaigns" subtitle="Mailchimp campaign analytics" isMock={data.is_mock} />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Campaigns"    value={s.total_campaigns}     accent="blue" />
        <KpiCard label="Total Sent"   value={s.total_sent.toLocaleString()} accent="purple" />
        <KpiCard label="Avg Open Rate" value={`${s.avg_open_rate}%`} accent="green" />
        <KpiCard label="Avg CTR"      value={`${s.avg_click_rate}%`} accent="teal" />
        <KpiCard label="Avg CTOR"     value={`${s.avg_ctor}%`}       accent="amber" />
        <KpiCard label="Est. Leads"   value={s.leads.toLocaleString()} accent="pink" />
      </div>

      {/* Category tabs */}
      <div className="mb-5 flex gap-2 flex-wrap">
        {(Object.keys(CAT_LABELS) as Category[]).map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              category === c
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {CAT_LABELS[c]}
            {c !== "all" && (
              <span className="ml-1.5 text-xs opacity-60">
                ({data.categories[c as Exclude<Category, "all">].count})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Category summary if filtered */}
      {catData && catData.count > 0 && (
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <KpiCard label="Campaigns"    value={catData.count}                     accent="blue" />
          <KpiCard label="Total Sent"   value={catData.total_sent.toLocaleString()} accent="purple" />
          <KpiCard label="Avg Open"     value={`${catData.avg_open_rate}%`}       accent="green" />
          <KpiCard label="Avg CTR"      value={`${catData.avg_click_rate}%`}      accent="teal" />
          <KpiCard label="Avg CTOR"     value={`${catData.avg_ctor}%`}            accent="amber" />
        </div>
      )}

      <div className="mb-6">
        <EdmRatesChart campaigns={filtered} />
      </div>

      <EdmTable campaigns={filtered} />
    </div>
  );
}
