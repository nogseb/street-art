import { X, MapPin, Calendar, Palette, Navigation, ChevronLeft, ChevronRight } from "lucide-react";
import { type Spot, artists, categoryColors, categoryLabels, spots } from "@/data/spots";
import { useState } from "react";
import ArtistModal from "./ArtistModal";
import type { Artist } from "@/data/spots";

interface SpotPanelProps {
  spot: Spot;
  onClose: () => void;
  isMobile?: boolean;
}

export default function SpotPanel({ spot, onClose, isMobile = false }: SpotPanelProps) { 
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const spotArtists = spot.artistIds.map((id) => artists[id]).filter(Boolean);
  const color = categoryColors[spot.category];
  const spotIndex = spots.findIndex((s) => s.id === spot.id);

  const navigateToSpot = (direction: "prev" | "next") => {
    const idx = direction === "next" ? spotIndex + 1 : spotIndex - 1;
    const targetSpot = spots[idx];
    if (targetSpot) {
      window.dispatchEvent(new CustomEvent("navigate-spot", { detail: targetSpot }));
    }
  };

  return (
    <>
      <div className={`h-full w-full flex flex-col bg-[#F8F6F3] overflow-y-auto overscroll-contain ${!isMobile ? 'animate-in slide-in-from-right duration-200' : ''}`}>
        {/* Header */}
        <div className={`sticky top-0 z-10 bg-[#F8F6F3] border-b border-[#E8E4DF] flex items-start justify-between ${isMobile ? 'px-4 py-3' : 'px-6 py-4'}`}>
          <div className="flex items-center gap-3">
            <div
              className={`rounded-full flex items-center justify-center text-white font-mono font-bold shrink-0 ${isMobile ? 'w-8 h-8 text-sm' : 'w-9 h-9 text-sm'}`}
              style={{ backgroundColor: color }}
            >
              {spot.id}
            </div>
            <div>
              <h2 className={`text-[#1A1A1A] leading-tight ${isMobile ? 'text-lg' : 'text-xl'}`} style={{ fontFamily: "'DM Serif Display', serif" }}>{spot.name}</h2>
              <span className="text-[10px] font-mono uppercase tracking-[0.15em]" style={{ color }}>
                {categoryLabels[spot.category]}
              </span>
            </div>
          </div>
          {!isMobile && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-muted transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className={`space-y-4 flex-1 ${isMobile ? 'px-4 py-4' : 'px-6 py-5 space-y-5'}`}>
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
                <Navigation className="w-4 h-4 shrink-0" />
                <span>{spot.walkTime} depuis l'étape précédente</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className={`leading-relaxed text-foreground/90 ${isMobile ? 'text-[13px]' : 'text-sm'}`}>
            {spot.description}
          </p>

          {/* Artists */}
          {spotArtists.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Palette className="w-3.5 h-3.5" />
                {spotArtists.length > 1 ? "Artistes" : "Artiste"}
              </h3>
              <div className="space-y-2">
                {spotArtists.map((artist) => (
                  <button
                    key={artist.id}
                    onClick={() => setSelectedArtist(artist)}
                    className={`w-full text-left rounded-lg border border-border active:scale-[0.98] transition-all group ${isMobile ? 'p-3.5' : 'p-3 hover:border-foreground/20 hover:bg-muted/50'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`font-medium text-foreground ${isMobile ? 'text-sm' : 'text-sm group-hover:text-primary transition-colors'}`}>
                          {artist.name}
                        </span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {artist.origin} · {artist.style}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer navigation - larger touch targets on mobile */}
        <div className={`border-t border-[#E8E4DF] bg-[#EDEAE6]/50 ${isMobile ? 'px-4 py-3 safe-area-bottom' : 'px-6 py-4'}`}>
          <div className="flex items-center justify-between">
            {spotIndex > 0 ? (
              <button
                onClick={() => navigateToSpot("prev")}
                className={`flex items-center gap-1 text-[#555] font-medium active:scale-[0.95] transition-transform ${isMobile ? 'text-sm py-1.5' : 'text-[11px] hover:text-[#1A1A1A]'}`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className={isMobile ? '' : 'hidden'}>Préc.</span>
              </button>
            ) : (
              <div />
            )}

            <p className={`font-mono text-[#8A8A8A] ${isMobile ? 'text-xs' : 'text-[11px]'}`}>
              {spot.id} / {spots.length}
            </p>

            {spotIndex < spots.length - 1 ? (
              <button
                onClick={() => navigateToSpot("next")}
                className={`flex items-center gap-1 text-[#FF3E52] font-semibold active:scale-[0.95] transition-transform ${isMobile ? 'text-sm py-1.5' : 'text-[11px] hover:underline'}`}
              >
                <span>Suivante</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div />
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
