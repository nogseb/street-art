import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, MapPin, Calendar, Navigation, Palette, ChevronLeft, ChevronRight, RotateCcw, Instagram, ExternalLink, Camera, Plus, Trash2, Image } from "lucide-react";
import { type Spot, artists, categoryColors, categoryLabels, spots } from "@/data/spots";
import type { Artist } from "@/data/spots";
import { usePhotoGallery } from "@/hooks/usePhotoGallery";

interface FlipCardProps {
  spot: Spot;
  onClose: () => void;
  isMobile?: boolean;
}

type CardFace = "front" | "artist" | "gallery";

export default function FlipCard({ spot, onClose, isMobile = false }: FlipCardProps) {
  const [face, setFace] = useState<CardFace>("front");
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { photos, addPhoto, deletePhoto } = usePhotoGallery(spot.id);

  // Reset state when spot changes
  useEffect(() => {
    setFace("front");
    setSelectedArtistId(null);
    setCarouselIndex(0);
  }, [spot.id]);

  const color = categoryColors[spot.category];
  const spotIndex = spots.findIndex((s) => s.id === spot.id);
  const spotArtists = spot.artistIds.map((id) => artists[id]).filter(Boolean);
  const currentArtist: Artist | null = selectedArtistId
    ? artists[selectedArtistId] || null
    : spotArtists[0] || null;

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lon}&travelmode=walking`;

  const navigateToSpot = (direction: "prev" | "next") => {
    const idx = direction === "next" ? spotIndex + 1 : spotIndex - 1;
    const targetSpot = spots[idx];
    if (targetSpot) {
      setFace("front");
      window.dispatchEvent(new CustomEvent("navigate-spot", { detail: targetSpot }));
    }
  };

  const handleFlipToArtist = (artistId?: string) => {
    if (artistId) setSelectedArtistId(artistId);
    setFace("artist");
  };

  const handleFlipToGallery = () => {
    setCarouselIndex(0);
    setFace("gallery");
  };

  const handleBack = () => {
    setFace("front");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      await addPhoto(files[i]);
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
    setCarouselIndex(photos.length); // go to newly added
  };

  // Determine transform based on face
  const getTransform = () => {
    if (face === "front") return "rotateY(0deg)";
    return "rotateY(180deg)";
  };

  const cardContent = (
    <div
      className={`flip-card-container ${isMobile ? "mobile" : "desktop"}`}
      style={{ perspective: "1200px", width: "100%", height: "100%" }}
    >
      <div
        className="flip-card-inner"
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
          transform: getTransform(),
        }}
      >
        {/* RECTO - Fiche fresque */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, width: "100%", height: "100%",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="h-full flex flex-col bg-[#F8F6F3] dark:bg-[#1E1E1E] rounded-t-2xl md:rounded-none overflow-hidden">
            {/* Header */}
            <div className={`shrink-0 bg-[#F8F6F3] dark:bg-[#1E1E1E] border-b border-[#E8E4DF] dark:border-[#333] flex items-start justify-between ${isMobile ? "px-4 py-3" : "px-6 py-4"}`}>
              <div className="flex items-center gap-3">
                <div
                  className="rounded-full flex items-center justify-center text-white font-mono font-bold shrink-0 w-8 h-8 text-sm"
                  style={{ backgroundColor: color }}
                >
                  {spot.id}
                </div>
                <div>
                  <h2 className={`text-[#1A1A1A] dark:text-white leading-tight ${isMobile ? "text-lg" : "text-xl"}`} style={{ fontFamily: "'DM Serif Display', serif" }}>
                    {spot.name}
                  </h2>
                  <span className="text-[10px] font-mono uppercase tracking-[0.15em]" style={{ color }}>
                    {categoryLabels[spot.category]}
                  </span>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors active:scale-[0.9]" aria-label="Fermer">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
           <div className={`flex-1 overflow-y-auto overscroll-contain ${isMobile ? "px-4 py-4 space-y-3" : "px-6 py-5 space-y-5"}`} style={{ WebkitOverflowScrolling: "touch" }}>
              {/* Spot photo */}
              {spot.photos && spot.photos.length > 0 && (
                <div className="w-full rounded-xl overflow-hidden">
                  <img
                    src={spot.photos[0]}
                    alt={spot.name}
                    className={`w-full object-cover ${isMobile ? "h-36" : "h-44"}`}
                  />
                </div>
              )}

             {/* Meta info */}
             <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#1A1A1A] dark:text-white">
                 <MapPin className="w-4 h-4 shrink-0" />
                 <span>{spot.address}</span>
               </div>
               {spot.year && (
                  <div className="flex items-center gap-2 text-sm text-[#1A1A1A] dark:text-white">
                   <Calendar className="w-4 h-4 shrink-0" />
                   <span>{spot.year}</span>
                 </div>
               )}
               {spot.walkTime && (
                  <div className="flex items-center gap-2 text-sm text-[#1A1A1A] dark:text-white">
                   <Navigation className="w-4 h-4 shrink-0" />
                   <span>{spot.walkTime} depuis l'étape précédente</span>
                 </div>
               )}
              </div>

              {/* Action buttons row */}
              <div className="flex gap-2">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#FF3E52] text-white font-medium active:scale-[0.97] transition-transform ${isMobile ? "py-3 text-sm" : "py-2.5 text-sm hover:bg-[#E63546]"}`}
                >
                  <ExternalLink className="w-4 h-4" />
                  Y aller
                </a>
                <button
                  onClick={handleFlipToGallery}
                  className={`flex items-center justify-center gap-2 rounded-xl border-2 border-[#E8E4DF] dark:border-[#444] text-[#555] dark:text-[#ccc] font-medium active:scale-[0.97] transition-transform relative ${isMobile ? "px-4 py-3 text-sm" : "px-4 py-2.5 text-sm hover:border-[#FF3E52] hover:text-[#FF3E52]"}`}
                >
                  <Camera className="w-4 h-4" />
                  <span>Photos</span>
                  {photos.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#FF3E52] text-white text-[10px] flex items-center justify-center font-bold">
                      {photos.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Description */}
              <p className={`leading-relaxed text-[#1A1A1A] dark:text-[#ddd] ${isMobile ? "text-[13px]" : "text-sm"}`}>
               {spot.description}
             </p>

              {/* Artists - tap to flip */}
             {spotArtists.length > 0 && (
               <div className="space-y-2.5">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-[#333] dark:text-[#aaa] flex items-center gap-2">
                   <Palette className="w-3.5 h-3.5" />
                   {spotArtists.length > 1 ? "Artistes" : "Artiste"} — toucher pour retourner
                 </h3>
                  <div className="space-y-2">
                    {spotArtists.map((artist) => (
                      <button
                        key={artist.id}
                        onClick={() => handleFlipToArtist(artist.id)}
                        className={`w-full text-left rounded-xl border border-border active:scale-[0.97] transition-all group ${isMobile ? "p-3.5" : "p-3 hover:border-foreground/20 hover:bg-muted/50"}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#EDEAE6] dark:bg-[#333] flex items-center justify-center shrink-0">
                              <span className="text-[#1A1A1A] dark:text-white font-bold text-[10px]">
                                {artist.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-foreground text-sm">{artist.name}</span>
                              <p className="text-xs text-[#333] dark:text-[#aaa] mt-0.5">{artist.origin}</p>
                           </div>
                          </div>
                          <RotateCcw className="w-3.5 h-3.5 text-[#FF3E52]" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer navigation */}
            <div className={`shrink-0 border-t border-[#E8E4DF] dark:border-[#333] bg-[#EDEAE6]/50 dark:bg-[#222]/50 ${isMobile ? "px-4 py-3" : "px-6 py-4"}`} style={{ paddingBottom: isMobile ? "env(safe-area-inset-bottom, 12px)" : undefined }}>
              <div className="flex items-center justify-between">
                {spotIndex > 0 ? (
                  <button onClick={() => navigateToSpot("prev")} className="flex items-center gap-1 text-[#555] dark:text-[#bbb] font-medium active:scale-[0.95] transition-transform text-sm py-1.5">
                    <ChevronLeft className="w-4 h-4" />
                    <span>Préc.</span>
                  </button>
                ) : <div />}
                <p className="font-mono text-[#8A8A8A] dark:text-[#666] text-xs">{spot.id} / {spots.length}</p>
                {spotIndex < spots.length - 1 ? (
                  <button onClick={() => navigateToSpot("next")} className="flex items-center gap-1 text-[#FF3E52] font-semibold active:scale-[0.95] transition-transform text-sm py-1.5">
                    <span>Suivante</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : <div />}
              </div>
            </div>
          </div>
        </div>

        {/* VERSO - Bio artiste OU Galerie photos */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, width: "100%", height: "100%",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {face === "gallery" ? (
            /* GALLERY VIEW */
            <div className="h-full flex flex-col bg-[#111] rounded-t-2xl md:rounded-none overflow-hidden">
              {/* Header galerie */}
              <div className={`shrink-0 border-b border-white/10 flex items-center justify-between ${isMobile ? "px-4 py-3" : "px-6 py-4"}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <Image className="w-4 h-4 text-white/70" />
                  </div>
                  <div>
                    <h2 className={`text-white leading-tight ${isMobile ? "text-base" : "text-lg"}`} style={{ fontFamily: "'DM Serif Display', serif" }}>
                      Mes photos
                    </h2>
                    <p className="text-[10px] text-white/50 font-mono uppercase tracking-wider">
                      {photos.length} photo{photos.length !== 1 ? "s" : ""} · {spot.name}
                    </p>
                  </div>
                </div>
                <button onClick={handleBack} className="p-2 rounded-full hover:bg-white/10 transition-colors active:scale-[0.9]" aria-label="Retourner">
                  <RotateCcw className="w-5 h-5 text-white/70" />
                </button>
              </div>

              {/* Gallery body */}
              <div className="flex-1 overflow-y-auto overscroll-contain flex flex-col items-center justify-center" style={{ WebkitOverflowScrolling: "touch" }}>
                {photos.length === 0 ? (
                  /* Empty state */
                  <div className="flex flex-col items-center gap-4 px-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white/30" />
                    </div>
                    <div>
                      <p className="text-white/80 text-sm font-medium">Aucune photo</p>
                      <p className="text-white/50 text-xs mt-1">Prenez une photo de la fresque et ajoutez-la ici</p>
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FF3E52] text-white text-sm font-medium active:scale-[0.97] transition-transform"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter une photo
                    </button>
                  </div>
                ) : (
                  /* Carousel */
                  <div className="w-full h-full flex flex-col">
                    <div className="flex-1 relative flex items-center justify-center px-4 py-4">
                      <img
                        src={photos[carouselIndex]?.dataUrl}
                        alt={`Photo ${carouselIndex + 1}`}
                        className="max-w-full max-h-full object-contain rounded-lg"
                      />
                      {/* Carousel nav arrows */}
                      {photos.length > 1 && (
                        <>
                          {carouselIndex > 0 && (
                            <button
                              onClick={() => setCarouselIndex((i) => i - 1)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center active:scale-[0.9] transition-transform"
                            >
                              <ChevronLeft className="w-5 h-5 text-white" />
                            </button>
                          )}
                          {carouselIndex < photos.length - 1 && (
                            <button
                              onClick={() => setCarouselIndex((i) => i + 1)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center active:scale-[0.9] transition-transform"
                            >
                              <ChevronRight className="w-5 h-5 text-white" />
                            </button>
                          )}
                        </>
                      )}
                      {/* Counter */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-xs font-mono px-3 py-1 rounded-full">
                        {carouselIndex + 1} / {photos.length}
                      </div>
                    </div>
                    {/* Thumbnail strip */}
                    {photos.length > 1 && (
                      <div className="shrink-0 px-4 pb-2 flex gap-2 overflow-x-auto">
                        {photos.map((photo, idx) => (
                          <button
                            key={photo.id}
                            onClick={() => setCarouselIndex(idx)}
                            className={`shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${idx === carouselIndex ? "border-[#FF3E52] scale-105" : "border-transparent opacity-60"}`}
                          >
                            <img src={photo.dataUrl} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer galerie */}
              <div className={`shrink-0 border-t border-white/10 flex items-center gap-2 ${isMobile ? "px-4 py-3" : "px-6 py-4"}`} style={{ paddingBottom: isMobile ? "env(safe-area-inset-bottom, 12px)" : undefined }}>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#FF3E52] text-white text-sm font-medium active:scale-[0.97] transition-transform"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter
                </button>
                {photos.length > 0 && photos[carouselIndex] && (
                  <button
                    onClick={() => {
                      const photoId = photos[carouselIndex].id;
                      deletePhoto(photoId);
                      setCarouselIndex((i) => Math.max(0, i - 1));
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 text-white/70 text-sm font-medium active:scale-[0.97] transition-transform"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* ARTIST BIO VIEW */
            <div className="h-full flex flex-col bg-[#1A1A1A] rounded-t-2xl md:rounded-none overflow-hidden">
              {/* Header verso */}
              <div className={`shrink-0 border-b border-white/10 flex items-start justify-between ${isMobile ? "px-4 py-3" : "px-6 py-4"}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-xs">
                      {currentArtist?.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className={`text-white leading-tight ${isMobile ? "text-lg" : "text-xl"}`} style={{ fontFamily: "'DM Serif Display', serif" }}>
                      {currentArtist?.name}
                    </h2>
                    <p className="text-[11px] text-white/60 mt-0.5">
                      {currentArtist?.born && `Né en ${currentArtist.born} · `}{currentArtist?.origin}
                    </p>
                  </div>
                </div>
                <button onClick={handleBack} className="p-2 rounded-full hover:bg-white/10 transition-colors active:scale-[0.9]" aria-label="Retourner">
                  <RotateCcw className="w-5 h-5 text-white/70" />
                </button>
              </div>

              {/* Body verso */}
              <div className={`flex-1 overflow-y-auto overscroll-contain space-y-4 ${isMobile ? "px-4 py-4" : "px-6 py-5"}`} style={{ WebkitOverflowScrolling: "touch" }}>
                {/* Style tags */}
                {currentArtist && (
                  <div className="flex flex-wrap gap-2">
                    {currentArtist.style.split(", ").map((tag) => (
                      <span key={tag} className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/10 text-[11px] text-white/80 font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bio */}
                <p className={`leading-relaxed text-white/85 ${isMobile ? "text-[13px]" : "text-sm"}`}>
                  {currentArtist?.bio}
                </p>

                {/* Instagram */}
                {currentArtist?.instagram && (
                  <a
                    href={`https://instagram.com/${currentArtist.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/20 text-sm font-medium text-white active:scale-[0.97] transition-transform hover:bg-white/5"
                  >
                    <Instagram className="w-4 h-4" />
                    @{currentArtist.instagram}
                  </a>
                )}

                {/* Multiple artists selector */}
                {spotArtists.length > 1 && (
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-2">Autres artistes</p>
                    <div className="flex gap-2">
                      {spotArtists.filter(a => a.id !== selectedArtistId).map((artist) => (
                        <button
                          key={artist.id}
                          onClick={() => setSelectedArtistId(artist.id)}
                          className="px-3 py-1.5 rounded-lg bg-white/10 text-xs text-white/80 font-medium active:scale-[0.95] transition-transform"
                        >
                          {artist.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer verso */}
              <div className={`shrink-0 border-t border-white/10 ${isMobile ? "px-4 py-3" : "px-6 py-4"}`} style={{ paddingBottom: isMobile ? "env(safe-area-inset-bottom, 12px)" : undefined }}>
                <button
                  onClick={handleBack}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 text-white text-sm font-medium active:scale-[0.97] transition-transform hover:bg-white/15"
                >
                  <RotateCcw className="w-4 h-4" />
                  Retourner vers la fresque
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input for photo upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={handleFileUpload}
      />
    </div>
  );

  // Mobile: render as a portal overlay
  if (isMobile) {
    return createPortal(
      <div
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 9000,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        {/* Backdrop */}
        <div
          className="animate-in fade-in duration-200"
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
          onClick={onClose}
        />
        {/* Card container */}
        <div
          className="relative animate-in slide-in-from-bottom duration-300"
          style={{
            height: "calc(82 * var(--vh, 1vh))",
            maxHeight: "82vh",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            overflow: "hidden",
          }}
        >
          {cardContent}
        </div>
      </div>,
      document.body
    );
  }

  // Desktop: inline
  return cardContent;
}
