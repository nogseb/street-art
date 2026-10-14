import { beforeEach, describe, expect, it, vi } from "vitest";

const { handlers, layer, tileLayer } = vi.hoisted(() => {
  const handlers: Record<string, (event: { tile: object }) => void> = {};
  const layer = { on: vi.fn() };
  const tileLayer = vi.fn(() => layer);
  return { handlers, layer, tileLayer };
});

vi.mock("leaflet", () => ({ default: { tileLayer } }));

import { createBasemapLayer } from "./basemap";

beforeEach(() => {
  vi.clearAllMocks();
  Object.keys(handlers).forEach((key) => delete handlers[key]);
  layer.on.mockImplementation((event, callback) => {
    handlers[event] = callback;
    return layer;
  });
});

describe("OpenStreetMap basemap", () => {
  it("uses the canonical HTTPS URL without an API key and visible attribution", () => {
    const result = createBasemapLayer(vi.fn());
    expect(result).toBe(layer);
    expect(tileLayer).toHaveBeenCalledWith(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      expect.objectContaining({
        attribution: expect.stringContaining("OpenStreetMap</a> contributors"),
        referrerPolicy: "strict-origin-when-cross-origin",
        maxZoom: 19,
        updateWhenIdle: true,
        keepBuffer: 1,
      }),
    );
  });

  it("reports a failed tile and clears the warning after that tile loads", () => {
    const report = vi.fn();
    createBasemapLayer(report);
    const tile = {};
    handlers.tileerror({ tile });
    expect(report).toHaveBeenLastCalledWith(true);
    handlers.tileload({ tile });
    expect(report).toHaveBeenLastCalledWith(false);
  });

  it("does not hide another outstanding tile error", () => {
    const report = vi.fn();
    createBasemapLayer(report);
    const first = {};
    const second = {};
    handlers.tileerror({ tile: first });
    handlers.tileerror({ tile: second });
    handlers.tileload({ tile: first });
    expect(report).toHaveBeenLastCalledWith(true);
    handlers.tileunload({ tile: second });
    expect(report).toHaveBeenLastCalledWith(false);
  });

  it("clears a failed tile when it leaves the viewport", () => {
    const report = vi.fn();
    createBasemapLayer(report);
    const tile = {};
    handlers.tileerror({ tile });
    handlers.tileunload({ tile });
    expect(report).toHaveBeenLastCalledWith(false);
  });
});
