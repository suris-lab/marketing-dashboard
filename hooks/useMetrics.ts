"use client";

import useSWR from "swr";
import type { MetricsResponse } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useMetrics(start: string, end: string) {
  const { data, error, isLoading } = useSWR<MetricsResponse>(
    `/api/metrics?start=${start}&end=${end}&platform=all`,
    fetcher,
    { revalidateOnFocus: false }
  );
  return { data, error, isLoading };
}
