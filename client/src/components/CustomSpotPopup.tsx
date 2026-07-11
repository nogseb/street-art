import type { CustomSpot } from "@/hooks/useCustomSpots";

interface CustomSpotPopupProps {
  spot: CustomSpot;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export default function CustomSpotPopup({ spot, onClose, onDelete }: CustomSpotPopupProps) {
  const date = new Date(spot.timestamp);
  const formattedDate = date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleDelete = () => {
    if (window.confirm("Supprimer ce spot personnalisé ?")) {
      onDelete(spot.id);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md bg-white dark:bg-[#2A2A2A] rounded-t-2xl sm:rounded-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Photo */}
        <div className="relative w-full aspect-[3/4] max-h-[60vh] bg-black">
          <img
            src={spot.photoDataUrl}
            alt={spot.label || "Spot personnalisé"}
            className="w-full h-full object-contain"
          />
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center active:scale-[0.92] transition-transform"
            aria-label="Fermer"
          >
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Info */}
        <div className="p-4 pb-8 sm:pb-4">
          {spot.label && (
            <h3 className="text-base font-semibold text-[#1A1A1A] dark:text-white font-['Space_Grotesk'] mb-1">
              {spot.label}
            </h3>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {formattedDate}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
            {spot.lat.toFixed(5)}, {spot.lon.toFixed(5)}
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => {
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lon}&travelmode=walking`,
                  "_blank"
                );
              }}
              className="flex-1 py-2.5 text-sm font-medium text-white bg-[#1A237E] rounded-lg flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 11 22 2 13 21 11 13 3 11" />
              </svg>
              Y aller
            </button>
            <button
              onClick={handleDelete}
              className="py-2.5 px-4 text-sm font-medium text-[#FF3E52] bg-red-50 dark:bg-red-900/20 rounded-lg active:scale-[0.97] transition-transform"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
