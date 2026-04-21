"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import type { DailyRow, TrafficSource } from "@/lib/types";

interface Props {
  daily: DailyRow[];
  trafficSources: TrafficSource[];
}

export function WebsiteCharts({ daily, trafficSources }: Props) {
  const areaData = daily.map((d) => ({
    date: d.date.slice(5),
    Sessions: d.sessions ?? 0,
    Users: d.users ?? 0,
  }));

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="col-span-2 rounded-xl border border-gray-800 bg-gray-900 p-5">
        <p className="mb-4 text-sm font-medium text-gray-400">Daily Sessions & Users</p>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={areaData}>
            <defs>
              <linearGradient id="web_ses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="web_usr" x1="0" y1="0" x2="0" y2="1">
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
            <Area type="monotone" dataKey="Sessions" stroke="#3b82f6" fill="url(#web_ses)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="Users"    stroke="#10b981" fill="url(#web_usr)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
        <p className="mb-4 text-sm font-medium text-gray-400">Traffic Sources</p>
        {trafficSources.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={trafficSources}
                  dataKey="sessions"
                  nameKey="source"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                >
                  {trafficSources.map((s, i) => (
                    <Cell key={i} fill={s.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <ul className="mt-3 space-y-1.5">
              {trafficSources.map((s) => (
                <li key={s.source} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-gray-400">{s.source}</span>
                  </span>
                  <span className="font-medium text-gray-300">{s.sessions.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mt-8 text-center text-sm text-gray-500">No traffic source data</p>
        )}
      </div>
    </div>
  );
}
