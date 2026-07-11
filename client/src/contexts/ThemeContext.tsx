import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme?: () => void;
  switchable: boolean;
  isAutoMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
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
  switchable = false,
  autoByTime = false,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (switchable) {
      const stored = localStorage.getItem("theme");
      return (stored as Theme) || defaultTheme;
    }
    if (autoByTime) {
      return shouldBeDark() ? "dark" : "light";
    }
    return defaultTheme;
  });

  // Auto-update theme based on time
  useEffect(() => {
    if (!autoByTime) return;
    
    const checkTime = () => {
      const newTheme = shouldBeDark() ? "dark" : "light";
      setTheme(newTheme);
    };
    
    // Check every 5 minutes
    const interval = setInterval(checkTime, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [autoByTime]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    if (switchable) {
      localStorage.setItem("theme", theme);
    }
  }, [theme, switchable]);

  const toggleTheme = switchable
    ? () => {
        setTheme(prev => (prev === "light" ? "dark" : "light"));
      }
    : undefined;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, switchable, isAutoMode: autoByTime }}>
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
