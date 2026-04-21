"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AssetCard } from "./AssetCard";
import { AddAssetForm } from "./AddAssetForm";
import { useAssets } from "@/hooks/useAssets";

export function AssetsSection() {
  const { assets, isLoading, addAsset, removeAsset } = useAssets();
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <SectionHeader title="Digital Assets" subtitle="Track and manage your digital marketing assets" />

      <div className="mb-5 flex justify-end">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          {showForm ? "Cancel" : "+ Add Asset"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <AddAssetForm
            onSubmit={async (payload) => {
              await addAsset(payload);
              setShowForm(false);
            }}
          />
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading assets…</p>
      ) : assets.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-700 p-12 text-center">
          <p className="text-sm text-gray-500">No assets yet. Add your first digital asset above.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((a) => (
            <AssetCard key={a.id} asset={a} onDelete={removeAsset} />
          ))}
        </div>
      )}
    </div>
  );
}
