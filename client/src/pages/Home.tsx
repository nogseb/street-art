import { useState, useCallback, useEffect } from "react";
import { MapPin, Route, Users, ChevronRight, List, Map as MapIcon } from "lucide-react";
import StreetArtMap from "@/components/StreetArtMap";
import FlipCard from "@/components/FlipCard";
import SpotList from "@/components/SpotList";
import { type Spot, spots } from "@/data/spots";
import { useIsMobile } from "@/hooks/useMobile";

export default function Home() {
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [showList, setShowList] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const isMobile = useIsMobile();

  // iOS viewport height fix: set --vh CSS variable
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);
    window.addEventListener("orientationchange", setVh);
    return () => {
      window.removeEventListener("resize", setVh);
      window.removeEventListener("orientationchange", setVh);
    };
  }, []);

  const handleSelectSpot = useCallback((spot: Spot) => {
    setSelectedSpot(spot);
    setShowList(false);
    setShowIntro(false);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedSpot(null);
    setShowIntro(true);
  }, []);

  // Auto-dismiss intro after 8s on mobile, 12s on desktop
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!selectedSpot) setShowIntro(false);
    }, isMobile ? 8000 : 12000);
    return () => clearTimeout(timer);
  }, [selectedSpot, isMobile]);

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
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-[#F8F6F3]">
      {/* Header - compact on mobile */}
      <header className="shrink-0 bg-[#F8F6F3]/95 backdrop-blur-md border-b border-[#E8E4DF] px-3 md:px-6 py-2.5 md:py-3 flex items-center justify-between z-50 safe-area-top">
        <div className="flex items-center gap-2">
          {/* ST.ART brand lockup */}
          <div className="flex items-baseline gap-0 select-none">
            <span className="text-xl md:text-[28px] font-bold tracking-[-0.03em] text-[#1A1A1A]" style={{ fontFamily: "'DM Serif Display', serif" }}>
              ST
            </span>
            <span className="text-xl md:text-[28px] font-bold text-[#FF3E52]" style={{ fontFamily: "'DM Serif Display', serif" }}>
              .
            </span>
            <span className="text-xl md:text-[28px] font-bold tracking-[-0.03em] text-[#1A1A1A]" style={{ fontFamily: "'DM Serif Display', serif" }}>
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
          {/* Stats - hidden on mobile */}
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

          {/* Toggle list view - larger touch target on mobile */}
          <button
            onClick={() => { setShowList(!showList); setSelectedSpot(null); setShowIntro(false); }}
            className={`flex items-center gap-1.5 px-3 py-2 md:px-3.5 md:py-1.5 rounded-lg md:rounded-md text-xs font-medium transition-all duration-150 active:scale-[0.95] ${
              showList
                ? "bg-[#1A1A1A] text-white"
                : "bg-[#EDEAE6] text-[#1A1A1A] hover:bg-[#E0DCD7]"
            }`}
          >
            {showList ? <MapIcon className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{showList ? "Carte" : "Liste"}</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Map */}
        <div className={`flex-1 relative transition-all duration-300 ${
          selectedSpot && !isMobile ? "md:flex-[6]" : "w-full"
        }`}>
          <StreetArtMap
            selectedSpot={selectedSpot}
            onSelectSpot={handleSelectSpot}
          />

          {/* Editorial intro panel (desktop only) */}
          {!selectedSpot && !showList && showIntro && (
            <div className="hidden md:block absolute top-6 left-6 max-w-[360px] z-20 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="bg-[#F8F6F3]/95 backdrop-blur-md rounded-xl border border-[#E8E4DF] shadow-lg overflow-hidden">
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

          {/* Mobile intro card - bottom of screen */}
          {!selectedSpot && !showList && showIntro && (
            <div className="md:hidden absolute bottom-0 left-0 right-0 z-[1000] animate-in slide-in-from-bottom-4 duration-400 safe-area-bottom">
              <div className="mx-3 mb-3 bg-white backdrop-blur-md rounded-2xl border border-[#E8E4DF] shadow-xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-[#FF3E52] via-[#1A237E] to-[#2D6A4F]" />
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-[#8A8A8A]">
                      <MapPin className="w-3 h-3 text-[#FF3E52]" />
                      7 étapes
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-[#8A8A8A]">
                      <Route className="w-3 h-3 text-[#FF3E52]" />
                      ~2 km
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-[#8A8A8A]">
                      <Users className="w-3 h-3 text-[#FF3E52]" />
                      7 artistes
                    </div>
                  </div>
                  <h2 className="text-lg leading-tight text-[#1A1A1A] mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                    Parcours street art de Saint-Denis
                  </h2>
                  <p className="text-[13px] text-[#555] leading-relaxed mb-4">
                    Touchez un marqueur ou démarrez le parcours guidé.
                  </p>
                  <button
                    onClick={() => handleSelectSpot(spots[0])}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#FF3E52] text-white text-sm font-semibold rounded-xl active:scale-[0.97] transition-transform duration-150"
                  >
                    Démarrer le parcours
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mobile: minimal hint when no intro and no spot */}
          {!selectedSpot && !showList && !showIntro && (
            <div className="md:hidden absolute bottom-0 left-0 right-0 z-[1000] safe-area-bottom">
              <div className="mx-3 mb-3 bg-white backdrop-blur-sm rounded-xl border border-[#E8E4DF] shadow-md px-4 py-3 flex items-center justify-between">
                <p className="text-xs text-[#555]">
                  Touchez un marqueur pour découvrir la fresque
                </p>
                <button
                  onClick={() => handleSelectSpot(spots[0])}
                  className="text-xs font-medium text-[#FF3E52] whitespace-nowrap ml-3"
                >
                  Étape 1 →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Side panel (desktop only) */}
        {selectedSpot && !isMobile && (
          <div className="hidden md:flex md:flex-[4] max-w-[420px] border-l border-[#E8E4DF] shrink-0 bg-[#F8F6F3]">
            <FlipCard spot={selectedSpot} onClose={handleClose} />
          </div>
        )}

        {/* Mobile: FlipCard as overlay */}
        {isMobile && selectedSpot && (
          <FlipCard spot={selectedSpot} onClose={handleClose} isMobile />
        )}

        {/* List view overlay */}
        {showList && (
          <div className="absolute inset-0 bg-[#F8F6F3] z-30 overflow-y-auto animate-in fade-in duration-200 overscroll-contain">
            <SpotList onSelectSpot={handleSelectSpot} />
          </div>
        )}
      </main>
    </div>
  );
}
