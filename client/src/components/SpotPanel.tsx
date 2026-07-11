import { X, MapPin, Calendar, Palette, ExternalLink } from "lucide-react";
import { type Spot, artists, categoryColors, categoryLabels, spots } from "@/data/spots";
import { useState } from "react";
import ArtistModal from "./ArtistModal";
import type { Artist } from "@/data/spots";

interface SpotPanelProps {
  spot: Spot;
  onClose: () => void;
}

export default function SpotPanel({ spot, onClose }: SpotPanelProps) { 
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const spotArtists = spot.artistIds.map((id) => artists[id]).filter(Boolean);
  const color = categoryColors[spot.category];
  const spotIndex = spots.findIndex((s) => s.id === spot.id);

  return (
    <>
      <div className="h-full w-full flex flex-col bg-[#F8F6F3] overflow-y-auto animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#F8F6F3] border-b border-[#E8E4DF] px-6 py-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-mono font-bold text-sm shrink-0"
              style={{ backgroundColor: color }}
            >
              {spot.id}
            </div>
            <div>
              <h2 className="text-xl text-[#1A1A1A] leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>{spot.name}</h2>
              <span className="text-[10px] font-mono uppercase tracking-[0.15em]" style={{ color }}>
                {categoryLabels[spot.category]}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-5 flex-1">
          {/* Meta info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{spot.address}</span>
            </div>
            {spot.year && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>{spot.year}</span>
              </div>
            )}
            {spot.walkTime && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-4 h-4 shrink-0 flex items-center justify-center text-xs">🚶</span>
                <span>{spot.walkTime} depuis l'étape précédente</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed text-foreground/90">
            {spot.description}
          </p>

          {/* Artists */}
          {spotArtists.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Palette className="w-3.5 h-3.5" />
                {spotArtists.length > 1 ? "Artistes" : "Artiste"}
              </h3>
              <div className="space-y-2">
                {spotArtists.map((artist) => (
                  <button
                    key={artist.id}
                    onClick={() => setSelectedArtist(artist)}
                    className="w-full text-left p-3 rounded-lg border border-border hover:border-foreground/20 hover:bg-muted/50 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                          {artist.name}
                        </span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {artist.origin} · {artist.style}
                        </p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer navigation hint */}
        <div className="px-6 py-4 border-t border-[#E8E4DF] bg-[#EDEAE6]/50">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-mono text-[#8A8A8A]">
              Étape {spot.id} / {spots.length}
            </p>
            {spotIndex < spots.length - 1 && (
              <button
                onClick={() => {
                  const nextSpot = spots[spotIndex + 1];
                  if (nextSpot) {
                    window.dispatchEvent(new CustomEvent("navigate-spot", { detail: nextSpot }));
                  }
                }}
                className="text-[11px] text-[#FF3E52] font-medium hover:underline"
              >
                Étape suivante →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Artist Modal */}
      {selectedArtist && (
        <ArtistModal artist={selectedArtist} onClose={() => setSelectedArtist(null)} />
      )}
    </>
  );
}
