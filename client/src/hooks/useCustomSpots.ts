import { useState, useEffect, useCallback } from "react";
import exifr from "exifr";

export interface CustomSpot {
  id: string;
  lat: number;
  lon: number;
  photoDataUrl: string;
  timestamp: number;
  label?: string;
}

const DB_NAME = "streetart-custom-spots";
const STORE_NAME = "spots";
const DB_VERSION = 1;
const LS_KEY = "streetart-custom-spots-backup";

// ─── IndexedDB helpers ───────────────────────────────────────────────

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function idbGetAll(): Promise<CustomSpot[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return [];
  }
}

async function idbPut(spot: CustomSpot): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.put(spot);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Silently fail — localStorage backup will handle it
  }
}

async function idbDelete(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Silently fail
  }
}

// ─── localStorage helpers (fallback/backup) ─────────────────────────

function lsGetAll(): CustomSpot[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CustomSpot[];
  } catch {
    return [];
  }
}

function lsSaveAll(spots: CustomSpot[]): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(spots));
  } catch {
    // Quota exceeded — try removing oldest spots to fit
    try {
      const trimmed = spots.slice(-5); // Keep only last 5
      localStorage.setItem(LS_KEY, JSON.stringify(trimmed));
    } catch {
      // Give up on localStorage
    }
  }
}

// ─── Unified read: merge IDB + LS, deduplicate ─────────────────────

async function getAllSpots(): Promise<CustomSpot[]> {
  const [idbSpots, lsSpots] = await Promise.all([
    idbGetAll(),
    Promise.resolve(lsGetAll()),
  ]);

  // Merge and deduplicate by id (IDB takes priority)
  const map = new Map<string, CustomSpot>();
  for (const s of lsSpots) map.set(s.id, s);
  for (const s of idbSpots) map.set(s.id, s);

  const merged = Array.from(map.values()).sort((a, b) => a.timestamp - b.timestamp);

  // Sync back: ensure both stores have the full set
  if (idbSpots.length < merged.length) {
    for (const s of merged) {
      if (!idbSpots.find((x) => x.id === s.id)) {
        idbPut(s); // fire and forget
      }
    }
  }
  if (lsSpots.length < merged.length) {
    lsSaveAll(merged);
  }

  return merged;
}

// ─── Image processing ───────────────────────────────────────────────

function fileToDataUrl(file: File, maxWidth = 800): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // Use lower quality to stay within storage limits
        resolve(canvas.toDataURL("image/jpeg", 0.65));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// ─── GPS extraction ─────────────────────────────────────────────────

export interface GpsResult {
  lat: number;
  lon: number;
}

export async function extractGps(file: File): Promise<GpsResult | null> {
  try {
    const gps = await exifr.gps(file);
    if (gps && gps.latitude && gps.longitude) {
      return { lat: gps.latitude, lon: gps.longitude };
    }
    return null;
  } catch {
    return null;
  }
}

// ─── Hook ───────────────────────────────────────────────────────────

export function useCustomSpots() {
  const [spots, setSpots] = useState<CustomSpot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllSpots()
      .then((s) => {
        setSpots(s);
        setLoading(false);
      })
      .catch(() => {
        // Last resort: try localStorage only
        setSpots(lsGetAll());
        setLoading(false);
      });
  }, []);

  const add = useCallback(async (file: File, gps: GpsResult, label?: string) => {
    const photoDataUrl = await fileToDataUrl(file);
    const spot: CustomSpot = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      lat: gps.lat,
      lon: gps.lon,
      photoDataUrl,
      timestamp: Date.now(),
      label: label || undefined,
    };

    // Write to both stores
    await idbPut(spot);
    const updated = [...spots, spot];
    lsSaveAll(updated);
    setSpots(updated);
    return spot;
  }, [spots]);

  const remove = useCallback(async (id: string) => {
    await idbDelete(id);
    const updated = spots.filter((s) => s.id !== id);
    lsSaveAll(updated);
    setSpots(updated);
  }, [spots]);

  return { spots, loading, add, remove };
}
