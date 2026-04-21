import { randomUUID } from "crypto";
import type { Asset } from "@/lib/types";

// In-memory fallback for local dev (no Vercel KV configured)
const memStore: Map<string, Asset> = new Map();

async function getKv() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  try {
    const { kv } = await import("@vercel/kv");
    return kv;
  } catch {
    return null;
  }
}

export async function listAssets(): Promise<Asset[]> {
  const kv = await getKv();
  if (kv) {
    const ids = (await kv.lrange<string>("asset_ids", 0, -1)) ?? [];
    const assets = await Promise.all(ids.map((id) => kv.get<Asset>(`asset:${id}`)));
    return assets.filter((a): a is Asset => a !== null);
  }
  return Array.from(memStore.values()).sort(
    (a, b) => new Date(b.added_date).getTime() - new Date(a.added_date).getTime()
  );
}

export async function addAsset(
  name: string,
  platform: string,
  type: string,
  url: string
): Promise<Asset> {
  const asset: Asset = {
    id: randomUUID(),
    name,
    platform,
    type,
    url,
    added_date: new Date().toISOString().slice(0, 10),
  };

  const kv = await getKv();
  if (kv) {
    await kv.set(`asset:${asset.id}`, asset);
    await kv.lpush("asset_ids", asset.id);
  } else {
    memStore.set(asset.id, asset);
  }

  return asset;
}

export async function deleteAsset(id: string): Promise<boolean> {
  const kv = await getKv();
  if (kv) {
    const exists = await kv.get(`asset:${id}`);
    if (!exists) return false;
    await kv.del(`asset:${id}`);
    await kv.lrem("asset_ids", 0, id);
    return true;
  }
  return memStore.delete(id);
}
