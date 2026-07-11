import { X, Instagram } from "lucide-react";
import type { Artist } from "@/data/spots";

interface ArtistModalProps {
  artist: Artist;
  onClose: () => void;
}

export default function ArtistModal({ artist, onClose }: ArtistModalProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto animate-in zoom-in-95 fade-in duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-card z-10 px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar with initials */}
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-serif text-xl">
                  {artist.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                </span>
              </div>
              <div>
                <h2 className="font-serif text-2xl text-foreground">{artist.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Né en {artist.born} · {artist.origin}
                </p>
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
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Style badge */}
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-muted text-xs font-mono text-muted-foreground">
            {artist.style}
          </div>

          {/* Bio */}
          <p className="text-sm leading-relaxed text-foreground/90">
            {artist.bio}
          </p>

          {/* Links */}
          {artist.instagram && (
            <a
              href={`https://instagram.com/${artist.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline transition-colors"
            >
              <Instagram className="w-4 h-4" />
              @{artist.instagram}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

