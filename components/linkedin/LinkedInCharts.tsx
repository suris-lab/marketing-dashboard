"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from "recharts";
import type { DailyRow } from "@/lib/types";

interface Props {
  daily: DailyRow[];
}

export function LinkedInCharts({ daily }: Props) {
  const data = daily.map((d) => ({
    date: d.date.slice(5),
    Impressions: d.impressions ?? 0,
    Clicks: d.clicks ?? 0,
  }));

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <p className="mb-4 text-sm font-medium text-gray-400">Daily Impressions & Clicks</p>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="li_imp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="li_clk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b7280" }} />
          <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: 8 }}
            labelStyle={{ color: "#9ca3af" }}
          />
          <Legend />
          <Area type="monotone" dataKey="Impressions" stroke="#3b82f6" fill="url(#li_imp)" strokeWidth={2} dot={false} />
          <Area type="monotone" dataKey="Clicks"      stroke="#10b981" fill="url(#li_clk)" strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
