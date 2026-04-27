import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { spamCheck } from "../../utils/helpers";

// ── Button ────────────────────────────────────────────────────
export const Btn = ({ children, onClick, disabled, variant = "primary", size = "md", style = {} }) => {
  const { theme } = useTheme();
  const [hover, setHover] = useState(false);

  const base = {
    border: "none", borderRadius: 12, cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "inherit", fontWeight: 700, transition: "all 0.2s",
    transform: hover && !disabled ? "translateY(-1px)" : "translateY(0)",
    opacity: disabled ? 0.55 : 1, display: "inline-flex",
    alignItems: "center", justifyContent: "center", gap: 8,
  };

  const sizes = {
    sm: { padding: "7px 14px", fontSize: 12 },
    md: { padding: "11px 22px", fontSize: 14 },
    lg: { padding: "14px 32px", fontSize: 15 },
  };

  const variants = {
    primary: {
      background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentAlt})`,
      color: "#fff",
      boxShadow: hover && !disabled ? `0 6px 24px ${theme.accentGlow}` : "none",
    },
    secondary: {
      background: theme.surface,
      border: `1px solid ${theme.border}`,
      color: theme.textSoft,
    },
    ghost: {
      background: hover ? theme.surfaceHover : "transparent",
      border: `1px solid ${hover ? theme.borderHover : "transparent"}`,
      color: hover ? theme.accent : theme.textMuted,
    },
    danger: {
      background: hover ? "rgba(248,113,113,0.15)" : "rgba(248,113,113,0.08)",
      border: "1px solid rgba(248,113,113,0.3)",
      color: theme.red,
    },
    success: {
      background: hover ? "rgba(52,211,153,0.2)" : "rgba(52,211,153,0.1)",
      border: `1px solid rgba(52,211,153,0.3)`,
      color: theme.green,
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
    >
      {children}
    </button>
  );
};

// ── Input ─────────────────────────────────────────────────────
export const Input = ({ value, onChange, placeholder, multiline = false, rows = 3, type = "text", label, error, style = {} }) => {
  const { theme } = useTheme();
  const [focus, setFocus] = useState(false);

  const inputStyle = {
    width: "100%", background: theme.inputBg,
    border: `1px solid ${focus ? theme.borderHover : error ? theme.red : theme.border}`,
    borderRadius: 12, padding: "11px 15px",
    color: theme.text, fontSize: 14, fontFamily: "inherit",
    boxSizing: "border-box", outline: "none",
    transition: "border 0.2s, box-shadow 0.2s", resize: "none",
    boxShadow: focus ? `0 0 0 3px ${theme.accentGlow}` : "none",
    ...style,
  };

  return (
    <div style={{ width: "100%" }}>
      {label && (
        <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 7 }}>
          {label}
        </div>
      )}
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={inputStyle} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} />
      }
      {error && <div style={{ fontSize: 12, color: theme.red, marginTop: 5 }}>{error}</div>}
    </div>
  );
};

// ── Select ────────────────────────────────────────────────────
export const Select = ({ value, onChange, options, label, style = {} }) => {
  const { theme } = useTheme();
  return (
    <div style={{ width: "100%" }}>
      {label && <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 7 }}>{label}</div>}
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        width: "100%", background: theme.inputBg,
        border: `1px solid ${theme.border}`, borderRadius: 12,
        padding: "11px 15px", color: theme.text, fontSize: 14,
        fontFamily: "inherit", cursor: "pointer", outline: "none",
        boxSizing: "border-box", ...style,
      }}>
        {options.map(o => <option key={o} value={o} style={{ background: theme.bgSecond }}>{o}</option>)}
      </select>
    </div>
  );
};

// ── Card ──────────────────────────────────────────────────────
export const Card = ({ children, style = {}, onClick }) => {
  const { theme } = useTheme();
  return (
    <div onClick={onClick} style={{
      background: theme.card, border: `1px solid ${theme.border}`,
      borderRadius: 18, padding: "22px 24px",
      boxShadow: theme.shadow, transition: "border 0.2s, box-shadow 0.2s",
      cursor: onClick ? "pointer" : "default", ...style,
    }}>
      {children}
    </div>
  );
};

// ── Label ─────────────────────────────────────────────────────
export const Label = ({ children }) => {
  const { theme } = useTheme();
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>
      {children}
    </div>
  );
};

// ── Toggle ────────────────────────────────────────────────────
export const Toggle = ({ value, onChange, label }) => {
  const { theme } = useTheme();
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
      <div onClick={() => onChange(!value)} style={{
        width: 40, height: 22, borderRadius: 11,
        background: value ? theme.accent : theme.border,
        position: "relative", transition: "background 0.25s", flexShrink: 0,
      }}>
        <div style={{
          width: 16, height: 16, borderRadius: "50%", background: "#fff",
          position: "absolute", top: 3, left: value ? 21 : 3,
          transition: "left 0.25s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }} />
      </div>
      <span style={{ fontSize: 13, color: theme.textMuted }}>{label}</span>
    </label>
  );
};

// ── Spam Meter ────────────────────────────────────────────────
export const SpamMeter = ({ text }) => {
  const { theme } = useTheme();
  const { score, triggers } = spamCheck(text);
  const color = score === 0 ? theme.green : score < 30 ? theme.yellow : theme.red;
  const label = score === 0 ? "Clean ✓" : score < 30 ? "Low risk" : score < 60 ? "Risky" : "Danger!";
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: theme.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Spam Score</span>
        <span style={{ fontSize: 11, fontWeight: 700, color }}>{label} ({score}/100)</span>
      </div>
      <div style={{ background: theme.border, borderRadius: 6, height: 5, overflow: "hidden" }}>
        <div style={{ width: `${score}%`, height: "100%", background: `linear-gradient(90deg, ${theme.green}, ${color})`, borderRadius: 6, transition: "width 0.4s ease" }} />
      </div>
      {triggers.length > 0 && (
        <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 4 }}>
          {triggers.slice(0, 4).map(t => (
            <span key={t} style={{ fontSize: 10, background: `${theme.red}18`, color: theme.red, border: `1px solid ${theme.red}30`, borderRadius: 4, padding: "2px 7px" }}>{t}</span>
          ))}
          {triggers.length > 4 && <span style={{ fontSize: 10, color: theme.textMuted }}>+{triggers.length - 4} more</span>}
        </div>
      )}
    </div>
  );
};

// ── Copy Button ───────────────────────────────────────────────
export const CopyBtn = ({ text, size = "sm" }) => {
  const [done, setDone] = useState(false);
  const copy = () => { navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000); };
  return <Btn onClick={copy} variant={done ? "success" : "secondary"} size={size}>{done ? "✓ Copied" : "Copy"}</Btn>;
};

// ── Open Rate Badge ───────────────────────────────────────────
export const OpenRateBadge = ({ rate }) => {
  const { theme } = useTheme();
  const color = rate >= 35 ? theme.green : rate >= 25 ? theme.yellow : theme.textMuted;
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color, background: `${color}18`, border: `1px solid ${color}30`, borderRadius: 20, padding: "2px 10px" }}>
      ~{rate}% open rate
    </span>
  );
};

// ── Loader Spinner ────────────────────────────────────────────
export const Spinner = ({ size = 20, color }) => {
  const { theme } = useTheme();
  return (
    <div style={{
      width: size, height: size, border: `2px solid ${theme.border}`,
      borderTopColor: color || theme.accent, borderRadius: "50%",
      animation: "spin 0.7s linear infinite", flexShrink: 0,
    }} />
  );
};

// ── Star Rating ───────────────────────────────────────────────
export const StarRating = ({ value, onChange, readOnly = false }) => {
  const { theme } = useTheme();
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button key={star} onClick={() => !readOnly && onChange && onChange(star)} style={{
          background: "none", border: "none", cursor: readOnly ? "default" : "pointer",
          padding: "1px", fontSize: 16, lineHeight: 1,
          color: (value || 0) >= star ? theme.yellow : `${theme.textMuted}40`,
          transition: "color 0.15s",
        }}>★</button>
      ))}
    </div>
  );
};

// ── Alert ─────────────────────────────────────────────────────
export const Alert = ({ message, type = "error" }) => {
  const { theme } = useTheme();
  if (!message) return null;
  const colors = {
    error:   { bg: `${theme.red}12`,   border: `${theme.red}30`,   color: theme.red   },
    success: { bg: `${theme.green}12`, border: `${theme.green}30`, color: theme.green },
    info:    { bg: `${theme.accent}12`,border: `${theme.accent}30`,color: theme.accent},
  };
  const c = colors[type] || colors.error;
  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, padding: "11px 16px", color: c.color, fontSize: 13 }}>
      {type === "error" ? "⚠ " : type === "success" ? "✓ " : "ℹ "}{message}
    </div>
  );
};