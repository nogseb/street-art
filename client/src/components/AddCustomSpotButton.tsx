import { useRef, useState } from "react";
import { extractGps, type GpsResult } from "@/hooks/useCustomSpots";

interface AddCustomSpotButtonProps {
  onAdd: (file: File, gps: GpsResult, label?: string) => Promise<void>;
}

type Step = "idle" | "loading" | "confirm" | "error";

export default function AddCustomSpotButton({ onAdd }: AddCustomSpotButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [gps, setGps] = useState<GpsResult | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [label, setLabel] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setStep("loading");
    setFile(f);

    // Generate preview
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(f);

    // Extract GPS
    const gpsResult = await extractGps(f);
    if (gpsResult) {
      setGps(gpsResult);
      setStep("confirm");
    } else {
      setErrorMsg("Cette photo ne contient pas de données GPS. Prenez la photo directement avec l'appareil photo pour inclure la géolocalisation.");
      setStep("error");
    }

    // Reset input so same file can be re-selected
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleConfirm = async () => {
    if (!file || !gps) return;
    setStep("loading");
    await onAdd(file, gps, label.trim() || undefined);
    reset();
  };

  const reset = () => {
    setStep("idle");
    setPreview(null);
    setGps(null);
    setFile(null);
    setLabel("");
    setErrorMsg("");
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => inputRef.current?.click()}
        className="absolute top-4 left-4 z-[1000] w-11 h-11 bg-[#FF3E52] rounded-full shadow-lg flex items-center justify-center active:scale-[0.92] transition-transform"
        aria-label="Ajouter un spot photo"
        title="Ajouter un spot photo"
      >
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      </button>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Overlay modal */}
      {step !== "idle" && (
        <div
          className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) reset(); }}
        >
          <div className="w-full max-w-sm bg-white dark:bg-[#2A2A2A] rounded-t-2xl sm:rounded-2xl p-5 pb-8 sm:pb-5 animate-in slide-in-from-bottom-4 duration-300">
            {step === "loading" && (
              <div className="flex flex-col items-center gap-3 py-8">
                <svg className="w-8 h-8 text-[#FF3E52] animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-sm text-gray-600 dark:text-gray-300">Lecture des données GPS...</p>
              </div>
            )}

            {step === "confirm" && preview && (
              <div className="flex flex-col gap-4">
                <h3 className="text-base font-semibold text-[#1A1A1A] dark:text-white font-['Space_Grotesk']">
                  Ajouter ce spot
                </h3>
                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  📍 {gps?.lat.toFixed(5)}, {gps?.lon.toFixed(5)}
                </p>
                <input
                  type="text"
                  placeholder="Nom du spot (optionnel)"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-[#333] text-[#1A1A1A] dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF3E52]/40"
                />
                <div className="flex gap-3">
                  <button
                    onClick={reset}
                    className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-[#444] rounded-lg active:scale-[0.97] transition-transform"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 py-2.5 text-sm font-medium text-white bg-[#FF3E52] rounded-lg active:scale-[0.97] transition-transform"
                  >
                    Ajouter au parcours
                  </button>
                </div>
              </div>
            )}

            {step === "error" && (
              <div className="flex flex-col gap-4 items-center text-center">
                <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#FF3E52]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{errorMsg}</p>
                <button
                  onClick={reset}
                  className="w-full py-2.5 text-sm font-medium text-white bg-[#FF3E52] rounded-lg active:scale-[0.97] transition-transform"
                >
                  Compris
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
