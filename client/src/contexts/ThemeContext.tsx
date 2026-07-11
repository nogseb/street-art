import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";
type ManualOverride = "light" | "dark" | "auto";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isAutoMode: boolean;
  manualOverride: ManualOverride;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  autoByTime?: boolean;
}

// Get current hour in La Réunion (UTC+4)
function getReunionHour(): number {
  const now = new Date();
  const utcHour = now.getUTCHours();
  return (utcHour + 4) % 24;
}

function shouldBeDark(): boolean {
  const hour = getReunionHour();
  return hour >= 18 || hour < 6; // Dark between 18h and 6h Réunion time
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  autoByTime = false,
}: ThemeProviderProps) {
  // Manual override: "auto" means follow time-based logic
  const [manualOverride, setManualOverride] = useState<ManualOverride>(() => {
    const stored = localStorage.getItem("theme-override");
    if (stored === "light" || stored === "dark") return stored;
    return "auto";
  });

  const [theme, setTheme] = useState<Theme>(() => {
    if (manualOverride !== "auto") return manualOverride;
    if (autoByTime) return shouldBeDark() ? "dark" : "light";
    return defaultTheme;
  });

  // Auto-update theme based on time (only when in auto mode)
  useEffect(() => {
    if (!autoByTime || manualOverride !== "auto") return;

    const checkTime = () => {
      const newTheme = shouldBeDark() ? "dark" : "light";
      setTheme(newTheme);
    };

    // Apply immediately
    checkTime();

    // Check every 5 minutes
    const interval = setInterval(checkTime, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [autoByTime, manualOverride]);

  // Apply manual override when it changes
  useEffect(() => {
    if (manualOverride !== "auto") {
      setTheme(manualOverride);
    }
    localStorage.setItem("theme-override", manualOverride);
  }, [manualOverride]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Cycle: auto → dark → light → auto
  const toggleTheme = useCallback(() => {
    setManualOverride((prev) => {
      if (prev === "auto") return "dark";
      if (prev === "dark") return "light";
      return "auto"; // light → auto
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isAutoMode: manualOverride === "auto", manualOverride }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
