"use client";

import useSWR from "swr";
import type { Asset } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useAssets() {
  const { data, error, isLoading, mutate } = useSWR<Asset[]>("/api/assets", fetcher);

  async function addAsset(payload: Omit<Asset, "id" | "added_date">) {
    await fetch("/api/assets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    mutate();
  }

  async function removeAsset(id: string) {
    await fetch(`/api/assets/${id}`, { method: "DELETE" });
    mutate();
  }

  return { assets: data ?? [], error, isLoading, addAsset, removeAsset };
}
