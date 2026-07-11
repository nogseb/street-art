import { MapPin, ChevronRight } from "lucide-react";
import { spots, artists, categoryColors, categoryLabels, type Spot } from "@/data/spots";

interface SpotListProps {
  onSelectSpot: (spot: Spot) => void;
}

export default function SpotList({ onSelectSpot }: SpotListProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 md:py-12 pb-20 md:pb-12">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#FF3E52] mb-2">
          Centre historique · Saint-Denis
        </p>
        <h2 className="text-2xl md:text-4xl text-[#1A1A1A] mb-2 md:mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>
          7 fresques, 2 km, 1 quartier
        </h2>
        <p className="text-[13px] md:text-sm text-[#555] leading-relaxed max-w-lg">
          Un parcours à pied dans le centre historique de Saint-Denis de La Réunion,
          à la découverte des plus belles oeuvres de street art de la ville.
          De Mr Dheo à Kid Kreol & Boogie, en passant par les emblématiques Gouzous de Jace.
        </p>
      </div>

      {/* Spot cards */}
      <div className="space-y-3">
        {spots.map((spot) => {
          const color = categoryColors[spot.category];
          const spotArtists = spot.artistIds.map((id) => artists[id]).filter(Boolean);

          return (
            <button
              key={spot.id}
              onClick={() => onSelectSpot(spot)}
              className="w-full text-left p-3.5 md:p-4 rounded-xl md:rounded-lg border border-border hover:border-foreground/20 bg-card hover:shadow-sm transition-all group active:scale-[0.98]"
            >
              <div className="flex items-start gap-3 md:gap-4">
                {/* Number */}
                <div
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-white font-mono font-bold text-xs md:text-sm shrink-0 mt-0.5"
                  style={{ backgroundColor: color }}
                >
                  {spot.id}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors">
                      {spot.name}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground truncate">{spot.address}</span>
                    {spot.walkTime && spot.walkTime !== "Départ" && (
                      <span className="text-xs text-muted-foreground/70 ml-auto shrink-0">
                        +{spot.walkTime}
                      </span>
                    )}
                  </div>

                  {spotArtists.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {spotArtists.map((artist) => (
                        <span
                          key={artist.id}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground"
                        >
                          {artist.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
        <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">Légende</h4>
        <div className="flex flex-wrap gap-4">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: categoryColors[key] }}
              />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer info */}
      <div className="mt-6 text-center text-xs text-muted-foreground">
        <p>Durée : 45-60 min · Distance : ~2 km · Gratuit</p>
        <p className="mt-1">Application recommandée : Street Art Cities (iOS/Android)</p>
      </div>
    </div>
  );
}
