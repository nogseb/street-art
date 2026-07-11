import { X, Instagram } from "lucide-react";
import type { Artist } from "@/data/spots";

interface ArtistModalProps {
  artist: Artist;
  onClose: () => void;
}

export default function ArtistModal({ artist, onClose }: ArtistModalProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-0 md:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal - bottom sheet on mobile, centered card on desktop */}
      <div className="relative w-full md:max-w-lg md:rounded-xl rounded-t-2xl bg-white shadow-2xl max-h-[85dvh] overflow-hidden animate-in slide-in-from-bottom-4 md:zoom-in-95 md:fade-in duration-300">
        {/* Drag handle on mobile */}
        <div className="md:hidden w-10 h-1 bg-[#CCC] rounded-full mx-auto mt-3" />

        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-5 pt-4 md:pt-6 pb-3 md:pb-4 border-b border-border">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-[#EDEAE6] flex items-center justify-center shrink-0">
                <span className="text-[#1A1A1A] font-bold text-sm md:text-xl">
                  {artist.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-lg md:text-2xl text-[#1A1A1A]" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  {artist.name}
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {artist.born && `Né en ${artist.born} · `}{artist.origin}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted transition-colors active:scale-[0.9]"
              aria-label="Fermer"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4 md:py-5 overflow-y-auto overscroll-contain max-h-[60dvh] space-y-4">
          {/* Style tags */}
          <div className="flex flex-wrap gap-2">
            {artist.style.split(", ").map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#EDEAE6] text-xs text-[#555] font-mono"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Bio */}
          <p className="text-[13px] md:text-sm leading-relaxed text-foreground/90">
            {artist.bio}
          </p>

          {/* Instagram link */}
          {artist.instagram && (
            <a
              href={`https://instagram.com/${artist.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-[#1A1A1A] active:scale-[0.97] transition-transform hover:bg-muted/50"
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
