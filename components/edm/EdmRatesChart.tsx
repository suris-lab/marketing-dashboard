"use client";

import { useState } from "react";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from "recharts";
import type { Campaign } from "@/lib/types";

interface Props {
  campaigns: Campaign[];
}

const SERIES = [
  { key: "Open Rate",  color: "#3b82f6", type: "bar"  },
  { key: "CTR",        color: "#10b981", type: "line" },
  { key: "CTOR",       color: "#f59e0b", type: "line" },
] as const;

export function EdmRatesChart({ campaigns }: Props) {
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const data = [...campaigns]
    .sort((a, b) => a.send_time.localeCompare(b.send_time))
    .map((c) => ({
      name: c.send_time.slice(0, 10),
      "Open Rate": c.open_rate,
      CTR: c.click_rate,
      CTOR: c.ctor,
    }));

  function toggle(key: string) {
    setHidden((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-400">Email Performance Rates (%)</p>
        <div className="flex gap-3">
          {SERIES.map((s) => (
            <button
              key={s.key}
              onClick={() => toggle(s.key)}
              className={`flex items-center gap-1.5 text-xs transition-opacity ${hidden.has(s.key) ? "opacity-30" : ""}`}
            >
              <span className="inline-block h-2 w-3 rounded-sm" style={{ backgroundColor: s.color }} />
              {s.key}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6b7280" }} />
          <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} unit="%" />
          <Tooltip
            contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: 8 }}
            labelStyle={{ color: "#9ca3af" }}
            formatter={(v: number) => `${v}%`}
          />
          {!hidden.has("Open Rate") && (
            <Bar dataKey="Open Rate" fill="#3b82f6" opacity={0.8} radius={[2, 2, 0, 0]} />
          )}
          {!hidden.has("CTR") && (
            <Line type="monotone" dataKey="CTR" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
          )}
          {!hidden.has("CTOR") && (
            <Line type="monotone" dataKey="CTOR" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
