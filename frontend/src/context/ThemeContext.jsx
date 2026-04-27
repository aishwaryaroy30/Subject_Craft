import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export const THEMES = {
  dark: {
    name: "dark",
    bg:        "#07070f",
    bgSecond:  "#0d0d1a",
    surface:   "rgba(255,255,255,0.03)",
    surfaceHover: "rgba(255,255,255,0.055)",
    border:    "rgba(255,255,255,0.08)",
    borderHover:"rgba(129,140,248,0.35)",
    text:      "#E2E8F0",
    textMuted: "rgba(200,210,240,0.45)",
    textSoft:  "rgba(200,210,240,0.65)",
    accent:    "#818CF8",
    accentAlt: "#A78BFA",
    accentGlow:"rgba(129,140,248,0.22)",
    header:    "rgba(7,7,15,0.88)",
    inputBg:   "rgba(255,255,255,0.04)",
    card:      "rgba(255,255,255,0.03)",
    shadow:    "0 8px 32px rgba(0,0,0,0.4)",
    green:     "#34D399",
    yellow:    "#FBBF24",
    red:       "#F87171",
    blue:      "#60A5FA",
    pink:      "#F472B6",
    orange:    "#FB923C",
  },
  light: {
    name: "light",
    bg:        "#F0F2FF",
    bgSecond:  "#E8EAFF",
    surface:   "rgba(255,255,255,0.85)",
    surfaceHover: "rgba(255,255,255,1)",
    border:    "rgba(129,140,248,0.18)",
    borderHover:"rgba(129,140,248,0.5)",
    text:      "#1E1B4B",
    textMuted: "rgba(79,70,229,0.5)",
    textSoft:  "rgba(30,27,75,0.7)",
    accent:    "#6366F1",
    accentAlt: "#8B5CF6",
    accentGlow:"rgba(99,102,241,0.15)",
    header:    "rgba(240,242,255,0.92)",
    inputBg:   "rgba(255,255,255,0.9)",
    card:      "rgba(255,255,255,0.85)",
    shadow:    "0 4px 24px rgba(99,102,241,0.12)",
    green:     "#059669",
    yellow:    "#D97706",
    red:       "#DC2626",
    blue:      "#2563EB",
    pink:      "#DB2777",
    orange:    "#EA580C",
  },
};

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState(
    () => localStorage.getItem("sc_theme") || "dark"
  );

  const theme = THEMES[themeName];

  useEffect(() => {
    localStorage.setItem("sc_theme", themeName);
    document.body.style.background = theme.bg;
    document.body.style.color = theme.text;
  }, [themeName, theme]);

  const toggleTheme = () =>
    setThemeName(p => (p === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, themeName, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
};