import L from "leaflet";

/**
 * Public OSM raster tiles: no API key. Browser cache and Referer are preserved.
 * Interactive viewing only — no offline downloads, prefetch or cache-busting.
 * https://operations.osmfoundation.org/policies/tiles/
 */
export function createBasemapLayer(
  onAvailabilityChange: (unavailable: boolean) => void,
): L.TileLayer {
  const failedTiles = new Set<HTMLImageElement>();
  const layer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    referrerPolicy: "strict-origin-when-cross-origin",
    updateWhenIdle: true,
    keepBuffer: 1,
  });

  layer.on("tileerror", (event: L.TileErrorEvent) => {
    failedTiles.add(event.tile);
    onAvailabilityChange(true);
  });
  const clearFailedTile = (event: L.TileEvent) => {
    failedTiles.delete(event.tile);
    onAvailabilityChange(failedTiles.size > 0);
  };
  layer.on("tileload", clearFailedTile);
  layer.on("tileunload", clearFailedTile);

  return layer;
}
