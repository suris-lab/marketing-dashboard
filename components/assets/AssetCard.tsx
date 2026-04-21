import { Trash2, ExternalLink } from "lucide-react";
import type { Asset } from "@/lib/types";

const PLATFORM_COLORS: Record<string, string> = {
  facebook:  "bg-blue-600/20 text-blue-400",
  instagram: "bg-pink-600/20 text-pink-400",
  linkedin:  "bg-sky-600/20 text-sky-400",
  website:   "bg-emerald-600/20 text-emerald-400",
  email:     "bg-amber-600/20 text-amber-400",
};

interface Props {
  asset: Asset;
  onDelete: (id: string) => void;
}

export function AssetCard({ asset, onDelete }: Props) {
  const colorClass = PLATFORM_COLORS[asset.platform.toLowerCase()] ?? "bg-gray-700/20 text-gray-400";

  return (
    <div className="flex flex-col rounded-xl border border-gray-800 bg-gray-900 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="truncate font-medium text-white">{asset.name}</p>
          <p className="mt-0.5 text-xs text-gray-500">{asset.added_date}</p>
        </div>
        <div className="flex gap-1.5 shrink-0">
          <a
            href={asset.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <ExternalLink size={14} />
          </a>
          <button
            onClick={() => onDelete(asset.id)}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-red-900/40 hover:text-red-400 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${colorClass}`}>
          {asset.platform}
        </span>
        <span className="rounded-full bg-gray-800 px-2 py-0.5 text-[10px] text-gray-400 capitalize">
          {asset.type}
        </span>
      </div>
    </div>
  );
}
