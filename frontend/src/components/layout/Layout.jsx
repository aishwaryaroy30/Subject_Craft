import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const NAV = [
  { path: "/",          label: "Generator",  icon: "✦" },
  { path: "/ab",        label: "A/B Studio", icon: "⇄" },
  { path: "/analytics", label: "Analytics",  icon: "◈" },
  { path: "/history",   label: "History",    icon: "◷" },
  { path: "/saved",     label: "Saved",      icon: "◆" },
  { path: "/guide",     label: "Playbook",   icon: "◉" },
];

export default function Layout({ children, savedCount = 0 }) {
  const { user, logout } = useAuth();
  const { theme, themeName, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenu, setUserMenu] = useState(false);

  const initials = user?.name
    ?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'DM Sans', sans-serif", color: theme.text }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0}to{opacity:1} }
        * { box-sizing: border-box; }
        input::placeholder, textarea::placeholder { color: ${theme.textMuted}; opacity: 0.6; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${theme.accent}40; border-radius: 3px; }
        select option { background: ${theme.bgSecond}; color: ${theme.text}; }
        button { transition: all 0.2s; }
      `}</style>

      {/* ── Header ── */}
      <header style={{
        background: theme.header, backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${theme.border}`,
        padding: "0 28px", position: "sticky", top: 0, zIndex: 200,
        display: "flex", alignItems: "center", height: 60, gap: 8,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 24, flexShrink: 0 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentAlt})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, boxShadow: `0 4px 12px ${theme.accentGlow}`,
          }}>✦</div>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 800, color: theme.text, letterSpacing: "-0.5px", lineHeight: 1 }}>SubjectCraft Pro</div>
            <div style={{ fontSize: 10, color: theme.textMuted, marginTop: 1 }}>AI Email Suite</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", gap: 3, flex: 1, overflowX: "auto" }}>
          {NAV.map(n => {
            const active = location.pathname === n.path;
            return (
              <button key={n.path} onClick={() => navigate(n.path)} style={{
                background: active ? theme.accentGlow : "transparent",
                border: `1px solid ${active ? theme.borderHover : "transparent"}`,
                color: active ? theme.accent : theme.textMuted,
                padding: "7px 14px", borderRadius: 9, cursor: "pointer",
                fontSize: 13, fontWeight: active ? 700 : 400,
                fontFamily: "inherit", display: "flex", alignItems: "center",
                gap: 5, whiteSpace: "nowrap", flexShrink: 0,
              }}>
                <span style={{ fontSize: 11, opacity: 0.8 }}>{n.icon}</span>
                {n.label}
                {n.path === "/saved" && savedCount > 0 && (
                  <span style={{
                    background: theme.accent, color: "#fff",
                    borderRadius: 20, fontSize: 10, fontWeight: 800,
                    padding: "1px 6px", marginLeft: 2,
                  }}>{savedCount}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto", flexShrink: 0 }}>
          {/* Theme toggle */}
          <button onClick={toggleTheme} title="Toggle theme" style={{
            background: theme.surface, border: `1px solid ${theme.border}`,
            borderRadius: 9, padding: "7px 12px", cursor: "pointer",
            color: theme.textMuted, fontSize: 14, fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 5,
          }}>
            {themeName === "dark" ? "☀" : "🌙"}
            <span style={{ fontSize: 12 }}>{themeName === "dark" ? "Light" : "Dark"}</span>
          </button>

          {/* User avatar + dropdown */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setUserMenu(p => !p)} style={{
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentAlt})`,
              border: "none", borderRadius: 10, width: 36, height: 36,
              cursor: "pointer", color: "#fff", fontSize: 13, fontWeight: 800,
              fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center",
            }}>{initials}</button>

            {userMenu && (
              <div style={{
                position: "absolute", right: 0, top: 44, width: 210,
                background: theme.card, border: `1px solid ${theme.border}`,
                borderRadius: 14, padding: 8, boxShadow: theme.shadow,
                animation: "fadeIn 0.15s ease", zIndex: 300,
              }}>
                <div style={{ padding: "10px 12px", borderBottom: `1px solid ${theme.border}`, marginBottom: 6 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>{user?.name}</div>
                  <div style={{ fontSize: 12, color: theme.textMuted }}>{user?.email}</div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                    color: theme.accent, background: theme.accentGlow,
                    border: `1px solid ${theme.borderHover}`, borderRadius: 20,
                    padding: "2px 8px", display: "inline-block", marginTop: 4,
                  }}>{user?.role}</span>
                </div>
                {[
                  { label: "Profile Settings", icon: "⚙", action: () => { navigate("/profile"); setUserMenu(false); } },
                  { label: "Sign Out", icon: "→", action: () => { logout(); navigate("/login"); }, danger: true },
                ].map(item => (
                  <button key={item.label} onClick={item.action} style={{
                    width: "100%", background: "none",
                    border: "none", borderRadius: 9, padding: "9px 12px",
                    color: item.danger ? theme.red : theme.textSoft,
                    cursor: "pointer", fontSize: 13, fontFamily: "inherit",
                    textAlign: "left", display: "flex", alignItems: "center", gap: 8,
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = theme.surfaceHover}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                  >
                    <span>{item.icon}</span>{item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Overlay to close menu */}
      {userMenu && <div onClick={() => setUserMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 199 }} />}

      {/* ── Page content ── */}
      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "28px 24px 60px" }}>
        {children}
      </main>
    </div>
  );
}