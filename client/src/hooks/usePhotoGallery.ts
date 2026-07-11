import { useState, useEffect, useCallback } from "react";

const DB_NAME = "start-gallery";
const STORE_NAME = "photos";
const DB_VERSION = 1;

interface StoredPhoto {
  id: string;
  spotId: number;
  dataUrl: string;
  timestamp: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("spotId", "spotId", { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function usePhotoGallery(spotId: number) {
  const [photos, setPhotos] = useState<StoredPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  // Load photos for this spot
  const loadPhotos = useCallback(async () => {
    try {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const index = store.index("spotId");
      const request = index.getAll(spotId);
      request.onsuccess = () => {
        const results = (request.result as StoredPhoto[]).sort(
          (a, b) => a.timestamp - b.timestamp
        );
        setPhotos(results);
        setLoading(false);
      };
      request.onerror = () => setLoading(false);
    } catch {
      setLoading(false);
    }
  }, [spotId]);

  useEffect(() => {
    setLoading(true);
    loadPhotos();
  }, [loadPhotos]);

  // Add a photo (from file input)
  const addPhoto = useCallback(
    async (file: File) => {
      return new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = async () => {
          const dataUrl = reader.result as string;
          const photo: StoredPhoto = {
            id: `${spotId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            spotId,
            dataUrl,
            timestamp: Date.now(),
          };
          try {
            const db = await openDB();
            const tx = db.transaction(STORE_NAME, "readwrite");
            tx.objectStore(STORE_NAME).put(photo);
            tx.oncomplete = () => {
              loadPhotos();
              resolve();
            };
          } catch {
            resolve();
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [spotId, loadPhotos]
  );

  // Delete a photo
  const deletePhoto = useCallback(
    async (photoId: string) => {
      try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).delete(photoId);
        tx.oncomplete = () => loadPhotos();
      } catch {
        // ignore
      }
    },
    [loadPhotos]
  );

  return { photos, loading, addPhoto, deletePhoto };
}
