import { describe, expect, it } from "vitest";
import { artists, spots } from "./spots";

describe("static street-art data", () => {
  it("preserves the eight numbered steps and their coordinates", () => {
    expect(spots.map((spot) => spot.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    for (const spot of spots) {
      expect(spot.name.length).toBeGreaterThan(0);
      expect(spot.description.length).toBeGreaterThan(0);
      expect(spot.lat).toBeGreaterThan(-21);
      expect(spot.lat).toBeLessThan(-20);
      expect(spot.lon).toBeGreaterThan(55);
      expect(spot.lon).toBeLessThan(56);
      for (const id of spot.artistIds) expect(artists[id]).toBeDefined();
    }
  });

  it("uses the local official photo without adding generic imagery", () => {
    expect(spots[0].photos).toEqual([
      `${import.meta.env.BASE_URL}images/tatie-monique.webp`,
    ]);
    expect(spots.slice(1).every((spot) => spot.photos?.length === 0)).toBe(true);
    expect(JSON.stringify(spots)).not.toContain("manus-storage");
  });

  it("keeps the corrected Instagram handle", () => {
    expect(artists.kidkreol.instagram).toBe("kidkreol.boogie");
  });
});
