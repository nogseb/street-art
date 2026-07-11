import { X, Instagram } from "lucide-react";
import { createPortal } from "react-dom";
import type { Artist } from "@/data/spots";

interface ArtistModalProps {
  artist: Artist;
  onClose: () => void;
}

export default function ArtistModal({ artist, onClose }: ArtistModalProps) {
  return createPortal(
    <div
      className="flex items-end md:items-center justify-center p-0 md:p-4"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
        // iOS Safari: ensure the overlay covers the full visual viewport
        height: "100%",
        width: "100%",
      }}
    >
      {/* Backdrop */}
      <div
        className="animate-in fade-in duration-200"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          WebkitBackdropFilter: "blur(4px)",
          backdropFilter: "blur(4px)",
        }}
        onClick={onClose}
      />

      {/* Modal - bottom sheet on mobile, centered card on desktop */}
      <div
        className="relative w-full md:max-w-lg md:rounded-xl rounded-t-2xl bg-white shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 md:zoom-in-95 md:fade-in duration-300"
        style={{
          maxHeight: "calc(85 * var(--vh, 1vh))",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
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
        <div
          className="px-5 py-4 md:py-5 overflow-y-auto overscroll-contain space-y-4"
          style={{
            maxHeight: "calc(60 * var(--vh, 1vh))",
            WebkitOverflowScrolling: "touch",
          }}
        >
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
    </div>,
    document.body
  );
}
