"use client";

import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from "recharts";
import type { DailyRow } from "@/lib/types";

interface Props {
  daily: DailyRow[];
  platform: "facebook" | "instagram";
}

const COLORS = {
  facebook:  { bar: "#3b82f6", line: "#10b981" },
  instagram: { bar: "#ec4899", line: "#f59e0b" },
};

export function MetaCharts({ daily, platform }: Props) {
  const c = COLORS[platform];
  const data = daily.map((d) => ({
    date: d.date.slice(5),
    Impressions: d.impressions ?? 0,
    Engagement: d.engagement ?? 0,
    Spend: d.spend ?? 0,
  }));

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <p className="mb-4 text-sm font-medium text-gray-400">Daily Impressions & Engagement</p>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b7280" }} />
          <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#6b7280" }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#6b7280" }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: 8 }}
            labelStyle={{ color: "#9ca3af" }}
          />
          <Legend />
          <Bar yAxisId="left"  dataKey="Impressions" fill={c.bar}  opacity={0.8} radius={[2, 2, 0, 0]} />
          <Line yAxisId="right" type="monotone" dataKey="Engagement" stroke={c.line} strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
