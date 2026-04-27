import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../services/api";
import { Card, Input, Btn, Alert } from "../ui";

// ── Playbook Page ─────────────────────────────────────────────
export function GuidePage() {
  const { theme } = useTheme();

  const tips = [
    { title: "The 4U Formula", icon: "🎯", color: theme.accent,
      content: "Every great subject line is Useful, Urgent, Unique, and Ultra-specific. Use this as a checklist before sending any campaign." },
    { title: "Character Count Sweet Spots", icon: "📏", color: theme.green,
      content: "Desktop shows ~60 chars, mobile ~40. Aim for 35–50 for universal compatibility. Front-load the most important words in the first 30 characters." },
    { title: "Power of Personalization", icon: "👤", color: theme.yellow,
      content: "Using [First Name] increases open rates by 22% on average. Go further with [Company Name] or [City] for hyper-personalization." },
    { title: "Curiosity Gap Psychology", icon: "🔍", color: theme.blue,
      content: "Create an information gap between what the reader knows and wants to know. 'The mistake 90% of marketers make' works because nobody wants to be in the 90%." },
    { title: "A/B Testing Protocol", icon: "⇄", color: theme.pink,
      content: "Always test one variable at a time. Send variant A to 20% of list, B to 20%, wait 4 hours, then send winner to remaining 60%." },
    { title: "Spam Trigger Avoidance", icon: "🚫", color: theme.red,
      content: "Words like FREE, URGENT, WINNER trigger spam filters. Use our Spam Meter to score each line before sending." },
    { title: "Timing Is Everything", icon: "⏰", color: theme.blue,
      content: "Tuesday–Thursday 9–11 AM and 1–3 PM show the highest open rates. Avoid Monday mornings and Friday afternoons." },
    { title: "Preview Text Strategy", icon: "✉", color: theme.orange,
      content: "Preview text (the snippet after subject in inbox) should complement, never repeat. Use it to continue the narrative or add a secondary hook." },
    { title: "Mobile-First Thinking", icon: "📱", color: theme.green,
      content: "Over 60% of emails are opened on mobile. Keep subjects under 40 chars and avoid punctuation at the end that gets cut off." },
    { title: "Power Words That Convert", icon: "⚡", color: theme.yellow,
      content: "Words like 'Exclusive', 'Revealed', 'Expires', 'Reminder', 'Last chance', and '[Name]' consistently increase open rates across industries." },
  ];

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, margin: "0 0 8px", color: theme.text }}>
          Marketing Playbook
        </h2>
        <p style={{ color: theme.textMuted, fontSize: 14, margin: 0 }}>
          Science-backed strategies for subject lines that drive opens and clicks
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {tips.map(tip => (
          <Card key={tip.title} style={{ borderLeft: `3px solid ${tip.color}50` }}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: `${tip.color}15`, border: `1px solid ${tip.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
              }}>{tip.icon}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: theme.text, marginBottom: 6 }}>{tip.title}</div>
                <div style={{ fontSize: 13, color: theme.textSoft, lineHeight: 1.75 }}>{tip.content}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick reference card */}
      <Card style={{ marginTop: 16, background: `${theme.accent}06`, border: `1px solid ${theme.borderHover}` }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: theme.accent, marginBottom: 14 }}>
          ⚡ Quick Reference Cheat Sheet
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 32px" }}>
          {[
            "Ideal length: 35–50 characters",
            "Best day to send: Tuesday",
            "Best time: 10 AM local time",
            "Personalization lifts open rate: +22%",
            "Question subject lines boost CTR: +10%",
            "Number-led lines perform 15% better",
            "Emojis at start: +25% in B2C",
            "Lowercase feels more personal",
          ].map(fact => (
            <div key={fact} style={{ fontSize: 12, color: theme.textMuted, display: "flex", gap: 7, alignItems: "flex-start" }}>
              <span style={{ color: theme.accent, flexShrink: 0, marginTop: 1 }}>→</span>{fact}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── Profile Page ──────────────────────────────────────────────
export function ProfilePage() {
  const { theme } = useTheme();
  const { user, updateUser } = useAuth();

  const [name, setName]       = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError]     = useState("");

  const save = async () => {
    if (!name.trim()) { setError("Name is required."); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      const res = await authAPI.updateProfile({ name });
      updateUser(res.data.user);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.error || "Update failed.");
    } finally { setLoading(false); }
  };

  const initials = user?.name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, margin: "0 0 24px", color: theme.text }}>
        Profile Settings
      </h2>

      <Card>
        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, paddingBottom: 24, borderBottom: `1px solid ${theme.border}` }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentAlt})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 800, color: "#fff",
            boxShadow: `0 6px 20px ${theme.accentGlow}`,
          }}>{initials}</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: theme.text }}>{user?.name}</div>
            <div style={{ fontSize: 13, color: theme.textMuted }}>{user?.email}</div>
            <span style={{
              fontSize: 11, fontWeight: 700, textTransform: "uppercase",
              color: theme.accent, background: theme.accentGlow,
              border: `1px solid ${theme.borderHover}`, borderRadius: 20,
              padding: "2px 10px", display: "inline-block", marginTop: 4,
            }}>{user?.role}</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input label="Full Name" value={name} onChange={setName} placeholder="Your name" />

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 7 }}>
              Email Address
            </div>
            <div style={{
              background: theme.surface, border: `1px solid ${theme.border}`,
              borderRadius: 12, padding: "11px 15px", color: theme.textMuted,
              fontSize: 14,
            }}>{user?.email}</div>
            <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 5 }}>Email cannot be changed.</div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 7 }}>
              Member Since
            </div>
            <div style={{
              background: theme.surface, border: `1px solid ${theme.border}`,
              borderRadius: 12, padding: "11px 15px", color: theme.textMuted, fontSize: 14,
            }}>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}
            </div>
          </div>

          <Alert message={error} type="error" />
          <Alert message={success} type="success" />

          <Btn onClick={save} disabled={loading} size="md">
            {loading ? "Saving..." : "Save Changes"}
          </Btn>
        </div>
      </Card>
    </div>
  );
}