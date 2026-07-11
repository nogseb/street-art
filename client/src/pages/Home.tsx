import { useState, useCallback, useEffect } from "react";
import { MapPin, Route, Users, ChevronRight } from "lucide-react";
import StreetArtMap from "@/components/StreetArtMap";
import SpotPanel from "@/components/SpotPanel";
import SpotList from "@/components/SpotList";
import { type Spot, spots } from "@/data/spots";

export default function Home() {
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [showList, setShowList] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const handleSelectSpot = useCallback((spot: Spot) => {
    setSelectedSpot(spot);
    setShowList(false);
    setShowIntro(false);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedSpot(null);
    setShowIntro(true);
  }, []);

  // Auto-dismiss intro after 12s
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!selectedSpot) setShowIntro(false);
    }, 12000);
    return () => clearTimeout(timer);
  }, [selectedSpot]);

  // Listen for navigate-spot events from SpotPanel
  useEffect(() => {
    const handler = (e: Event) => {
      const spot = (e as CustomEvent).detail as Spot;
      if (spot) handleSelectSpot(spot);
    };
    window.addEventListener("navigate-spot", handler);
    return () => window.removeEventListener("navigate-spot", handler);
  }, [handleSelectSpot]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#F8F6F3]">
      {/* Header */}
      <header className="shrink-0 bg-[#F8F6F3] border-b border-[#E8E4DF] px-4 md:px-6 py-3 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          {/* ST.ART brand lockup */}
          <div className="flex items-baseline gap-0 select-none">
            <span className="text-2xl md:text-[28px] font-bold tracking-[-0.03em] text-[#1A1A1A]" style={{ fontFamily: "'DM Serif Display', serif" }}>
              ST
            </span>
            <span className="text-2xl md:text-[28px] font-bold text-[#FF3E52]" style={{ fontFamily: "'DM Serif Display', serif" }}>
              .
            </span>
            <span className="text-2xl md:text-[28px] font-bold tracking-[-0.03em] text-[#1A1A1A]" style={{ fontFamily: "'DM Serif Display', serif" }}>
              ART
            </span>
          </div>
          <div className="hidden sm:block ml-3 pl-3 border-l border-[#E8E4DF]">
            <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#8A8A8A]">
              Saint-Denis · La Réunion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Stats */}
          <div className="hidden md:flex items-center gap-4 mr-4 text-[11px] font-mono text-[#8A8A8A]">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              {spots.length} étapes
            </span>
            <span className="flex items-center gap-1.5">
              <Route className="w-3 h-3" />
              ~2 km
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3 h-3" />
              7 artistes
            </span>
          </div>

          {/* Toggle list view */}
          <button
            onClick={() => { setShowList(!showList); setSelectedSpot(null); setShowIntro(false); }}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
              showList
                ? "bg-[#1A1A1A] text-white"
                : "bg-[#EDEAE6] text-[#1A1A1A] hover:bg-[#E0DCD7]"
            }`}
          >
            {showList ? "Carte" : "Liste"}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Map */}
        <div className={`flex-1 relative transition-all duration-300 ${
          selectedSpot ? "md:flex-[6]" : "w-full"
        }`}>
          <StreetArtMap
            selectedSpot={selectedSpot}
            onSelectSpot={handleSelectSpot}
          />

          {/* Editorial intro panel (desktop) */}
          {!selectedSpot && !showList && showIntro && (
            <div className="hidden md:block absolute top-6 left-6 max-w-[360px] z-20 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="bg-[#F8F6F3]/95 backdrop-blur-md rounded-xl border border-[#E8E4DF] shadow-lg overflow-hidden">
                {/* Accent bar */}
                <div className="h-1 bg-gradient-to-r from-[#FF3E52] via-[#1A237E] to-[#2D6A4F]" />
                <div className="p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#FF3E52] mb-3">
                    Parcours à pied · 45-60 min
                  </p>
                  <h2 className="text-[22px] leading-[1.2] text-[#1A1A1A] mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>
                    7 fresques, 2 km, 1 quartier qui se raconte sur ses murs
                  </h2>
                  <p className="text-[13px] text-[#555] leading-relaxed mb-5">
                    De la rue Labourdonnais au Bas de la Rivière, explorez les oeuvres de Mr Dheo, Jace, Kid Kreol & Boogie et Seth dans le centre historique de Saint-Denis.
                  </p>
                  <button
                    onClick={() => handleSelectSpot(spots[0])}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF3E52] text-white text-sm font-medium rounded-lg hover:bg-[#E8354A] transition-colors duration-150 active:scale-[0.97]"
                  >
                    Explorer le parcours
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mobile: intro card when no spot selected */}
          {!selectedSpot && !showList && (
            <div className="absolute bottom-0 left-0 right-0 md:hidden bg-[#F8F6F3]/95 backdrop-blur-md border-t border-[#E8E4DF] p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#FF3E52] mb-1 text-center">
                Parcours à pied · 45-60 min
              </p>
              <p className="text-sm text-center text-[#555]">
                Touchez un marqueur pour découvrir la fresque
              </p>
            </div>
          )}
        </div>

        {/* Side panel (desktop) */}
        {selectedSpot && (
          <div className="hidden md:flex md:flex-[4] max-w-[420px] border-l border-[#E8E4DF] shrink-0 bg-[#F8F6F3]">
            <SpotPanel spot={selectedSpot} onClose={handleClose} />
          </div>
        )}

        {/* Bottom sheet (mobile) */}
        {selectedSpot && (
          <div className="md:hidden absolute bottom-0 left-0 right-0 max-h-[70vh] bg-[#F8F6F3] rounded-t-2xl shadow-2xl border-t border-[#E8E4DF] overflow-y-auto animate-in slide-in-from-bottom duration-300 z-40">
            <div className="w-10 h-1 bg-[#CCC] rounded-full mx-auto mt-3 mb-1" />
            <SpotPanel spot={selectedSpot} onClose={handleClose} />
          </div>
        )}

        {/* List view overlay */}
        {showList && (
          <div className="absolute inset-0 bg-[#F8F6F3] z-30 overflow-y-auto animate-in fade-in duration-200">
            <SpotList onSelectSpot={handleSelectSpot} />
          </div>
        )}
      </main>
    </div>
  );
}
