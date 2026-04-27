import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Input, Btn, Alert, Spinner } from "../ui";

export default function AuthPage() {
  const { theme, toggleTheme, themeName } = useTheme();
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode]       = useState("login"); // "login" | "register"
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) { setError("Email and password are required."); return; }
    if (mode === "register" && !name) { setError("Name is required."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <div style={{
      minHeight: "100vh", background: theme.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px", position: "relative", overflow: "hidden",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />

      {/* Background blobs */}
      <div style={{
        position: "absolute", width: 500, height: 500, borderRadius: "50%",
        background: `radial-gradient(circle, ${theme.accentGlow} 0%, transparent 70%)`,
        top: -150, left: -150, pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: 400, height: 400, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)`,
        bottom: -100, right: -100, pointerEvents: "none",
      }} />

      {/* Theme toggle top-right */}
      <button onClick={toggleTheme} style={{
        position: "absolute", top: 20, right: 20,
        background: theme.surface, border: `1px solid ${theme.border}`,
        borderRadius: 10, padding: "8px 14px", cursor: "pointer",
        color: theme.textMuted, fontSize: 13, fontFamily: "inherit",
        display: "flex", alignItems: "center", gap: 6,
      }}>
        {themeName === "dark" ? "☀ Light" : "🌙 Dark"}
      </button>

      {/* Auth Card */}
      <div style={{
        width: "100%", maxWidth: 420,
        background: theme.card, border: `1px solid ${theme.border}`,
        borderRadius: 24, padding: "40px 36px",
        boxShadow: theme.shadow, position: "relative", zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16, margin: "0 auto 14px",
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentAlt})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, boxShadow: `0 8px 24px ${theme.accentGlow}`,
          }}>✦</div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800,
            margin: "0 0 6px", color: theme.text, letterSpacing: "-0.5px",
          }}>SubjectCraft Pro</h1>
          <p style={{ color: theme.textMuted, fontSize: 14, margin: 0 }}>
            {mode === "login" ? "Welcome back! Sign in to continue." : "Create your team account."}
          </p>
        </div>

        {/* Mode tabs */}
        <div style={{
          display: "flex", background: theme.surface,
          border: `1px solid ${theme.border}`, borderRadius: 12,
          padding: 4, marginBottom: 24, gap: 4,
        }}>
          {["login", "register"].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); }} style={{
              flex: 1, padding: "9px", borderRadius: 9, border: "none",
              background: mode === m ? `linear-gradient(135deg, ${theme.accent}, ${theme.accentAlt})` : "transparent",
              color: mode === m ? "#fff" : theme.textMuted,
              cursor: "pointer", fontSize: 13, fontWeight: 700,
              fontFamily: "inherit", transition: "all 0.2s", textTransform: "capitalize",
            }}>{m === "login" ? "Sign In" : "Register"}</button>
          ))}
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "register" && (
            <Input
              label="Full Name"
              value={name}
              onChange={setName}
              placeholder="e.g. Arjun Sharma"
              onKeyDown={handleKey}
            />
          )}
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@company.com"
            onKeyDown={handleKey}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder={mode === "register" ? "Min 6 characters" : "Your password"}
            onKeyDown={handleKey}
          />

          <Alert message={error} type="error" />

          <Btn
            onClick={handleSubmit}
            disabled={loading}
            size="lg"
            style={{ width: "100%", marginTop: 4 }}
          >
            {loading ? <><Spinner size={16} color="#fff" /> {mode === "login" ? "Signing in..." : "Creating account..."}</> : mode === "login" ? "Sign In →" : "Create Account →"}
          </Btn>
        </div>

        {/* Demo credentials hint */}
        {mode === "login" && (
          <div style={{
            marginTop: 20, padding: "12px 16px",
            background: `${theme.accent}10`, border: `1px solid ${theme.accent}25`,
            borderRadius: 10, fontSize: 12, color: theme.textMuted, textAlign: "center",
          }}>
            💡 Demo: <strong style={{ color: theme.accent }}>demo@subjectcraft.com</strong> / <strong style={{ color: theme.accent }}>demo123</strong>
          </div>
        )}

        <p style={{ textAlign: "center", fontSize: 12, color: theme.textMuted, marginTop: 20, marginBottom: 0 }}>
          {mode === "login" ? "New here? " : "Already have an account? "}
          <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }} style={{
            background: "none", border: "none", color: theme.accent,
            cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "inherit",
          }}>
            {mode === "login" ? "Create account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}