"use client";

import { useState } from "react";
import type { Asset } from "@/lib/types";

type Payload = Omit<Asset, "id" | "added_date">;

interface Props {
  onSubmit: (payload: Payload) => Promise<void>;
}

export function AddAssetForm({ onSubmit }: Props) {
  const [form, setForm] = useState<Payload>({ name: "", platform: "facebook", type: "page", url: "" });
  const [saving, setSaving] = useState(false);

  function set(key: keyof Payload, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSubmit(form);
    setSaving(false);
  }

  const inputClass =
    "w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-gray-700 bg-gray-900 p-5">
      <h3 className="mb-4 text-sm font-semibold text-white">Add Digital Asset</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-gray-400">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="HHYC Facebook Page"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-400">Platform</label>
          <select value={form.platform} onChange={(e) => set("platform", e.target.value)} className={inputClass}>
            {["facebook", "instagram", "linkedin", "website", "email", "other"].map((p) => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-400">Type</label>
          <select value={form.type} onChange={(e) => set("type", e.target.value)} className={inputClass}>
            {["page", "profile", "ad account", "campaign", "website", "landing page", "other"].map((t) => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-400">URL</label>
          <input
            required
            type="url"
            value={form.url}
            onChange={(e) => set("url", e.target.value)}
            placeholder="https://"
            className={inputClass}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={saving}
        className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {saving ? "Saving…" : "Add Asset"}
      </button>
    </form>
  );
}
