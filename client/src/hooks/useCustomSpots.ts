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

async function getAllSpots(): Promise<CustomSpot[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function addSpot(spot: CustomSpot): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(spot);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function removeSpot(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function fileToDataUrl(file: File, maxWidth = 1200): Promise<string> {
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
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

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

export function useCustomSpots() {
  const [spots, setSpots] = useState<CustomSpot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllSpots().then((s) => {
      setSpots(s);
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
    await addSpot(spot);
    setSpots((prev) => [...prev, spot]);
    return spot;
  }, []);

  const remove = useCallback(async (id: string) => {
    await removeSpot(id);
    setSpots((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return { spots, loading, add, remove };
}
