"use client";

import { useState } from "react";
import { Sidebar, type Tab } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useMetrics } from "@/hooks/useMetrics";
import { OverviewSection } from "@/components/overview/OverviewSection";
import { MetaSection } from "@/components/meta/MetaSection";
import { LinkedInSection } from "@/components/linkedin/LinkedInSection";
import { EdmSection } from "@/components/edm/EdmSection";
import { WebsiteSection } from "@/components/website/WebsiteSection";
import { AssetsSection } from "@/components/assets/AssetsSection";

function defaultDates() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 29);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [dates, setDates] = useState(defaultDates());

  const { data, isLoading, error } = useMetrics(dates.start, dates.end);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      <Sidebar active={tab} onChange={setTab} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          tab={tab}
          start={dates.start}
          end={dates.end}
          onDateChange={(start, end) => setDates({ start, end })}
        />

        <main className="flex-1 overflow-y-auto p-6">
          {isLoading && (
            <div className="flex h-48 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-900/40 bg-red-900/10 p-4 text-sm text-red-400">
              Failed to load data. Check your API configuration.
            </div>
          )}

          {data && !isLoading && (
            <>
              {tab === "overview" && data.overview && (
                <OverviewSection data={data.overview} />
              )}
              {tab === "meta" && data.meta && (
                <MetaSection data={data.meta} />
              )}
              {tab === "linkedin" && data.linkedin && (
                <LinkedInSection data={data.linkedin} />
              )}
              {tab === "edm" && data.edm && (
                <EdmSection data={data.edm} />
              )}
              {tab === "website" && data.website && (
                <WebsiteSection data={data.website} />
              )}
              {tab === "assets" && <AssetsSection />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
