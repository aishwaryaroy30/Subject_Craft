import { useState, useCallback } from "react";
import { useTheme } from "../../context/ThemeContext";
import { subjectAPI } from "../../services/api";
import { charColor, charLabel } from "../../utils/helpers";
import {
  Card, Label, Input, Select, Toggle, Btn,
  SpamMeter, CopyBtn, OpenRateBadge, StarRating, Alert, Spinner,
} from "../ui";

const TONES = [
  { id: "professional", label: "Professional", icon: "💼", color: "#60A5FA" },
  { id: "urgent",       label: "Urgent",       icon: "⚡", color: "#F87171" },
  { id: "playful",      label: "Playful",      icon: "🎉", color: "#FB923C" },
  { id: "curiosity",    label: "Curiosity",    icon: "🔍", color: "#C084FC" },
  { id: "fomo",         label: "FOMO",         icon: "🔥", color: "#F43F5E" },
  { id: "empathetic",   label: "Empathetic",   icon: "💛", color: "#34D399" },
  { id: "bold",         label: "Bold",         icon: "🚀", color: "#FBBF24" },
  { id: "minimalist",   label: "Minimalist",   icon: "✦",  color: "#94A3B8" },
];

const CAMPAIGN_TYPES = ["Product Launch","Newsletter","Promotional","Event Invite","Re-engagement","Onboarding","Awareness","Flash Sale","Webinar","Survey"];
const INDUSTRIES     = ["SaaS / Tech","E-commerce","Healthcare","Finance","Education","Retail","Real Estate","Travel","Food & Beverage","Non-profit"];

export default function GeneratorPage({ onSave, saved }) {
  const { theme } = useTheme();

  // Form state
  const [topic, setTopic]           = useState("");
  const [audience, setAudience]     = useState("");
  const [industry, setIndustry]     = useState("SaaS / Tech");
  const [campaignType, setCampaign] = useState("Product Launch");
  const [tones, setTones]           = useState(["professional"]);
  const [count, setCount]           = useState(6);
  const [brandVoice, setBrandVoice] = useState("");
  const [includeEmoji, setEmoji]    = useState(true);
  const [includeNumbers, setNums]   = useState(true);

  // Result state
  const [results, setResults]         = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [ratings, setRatings]         = useState({});
  const [refining, setRefining]       = useState(null);
  const [refined, setRefined]         = useState({});

  const toggleTone = (id) =>
    setTones(p => p.includes(id) ? p.filter(t => t !== id) : [...p, id].slice(0, 3));

  const generate = useCallback(async () => {
    if (!topic.trim()) { setError("Campaign topic is required."); return; }
    setError(""); setLoading(true); setResults([]);
    try {
      const { data } = await subjectAPI.generate({
        topic, audience, industry, campaignType,
        tones, count, brandVoice, includeEmoji, includeNumbers,
      });
      setResults(data.results || []);
    } catch (err) {
      setError(err.response?.data?.error || "Generation failed. Try again.");
    } finally {
      setLoading(false);
    }
  }, [topic, audience, industry, campaignType, tones, count, brandVoice, includeEmoji, includeNumbers]);

  const refineSubject = async (item, idx) => {
    setRefining(idx);
    try {
      const { data } = await subjectAPI.refine({
        subject: item.subject, hook: item.hook, campaignType,
      });
      setRefined(p => ({ ...p, [idx]: data.variations }));
    } catch {}
    finally { setRefining(null); }
  };

  const isSaved = (item) => saved?.some(s => s.subject === item.subject);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 20, alignItems: "start" }}>

      {/* ── LEFT: Form Panel ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 80 }}>
        <Card>
          <Input label="Campaign Topic *" value={topic} onChange={setTopic}
            placeholder="e.g. Summer sale — 60% off everything" />
        </Card>

        <Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Target Audience" value={audience} onChange={setAudience} placeholder="e.g. B2B founders, 30–50" />
            <Select label="Industry" value={industry} onChange={setIndustry} options={INDUSTRIES} />
            <div style={{ gridColumn: "1/-1" }}>
              <Select label="Campaign Type" value={campaignType} onChange={setCampaign} options={CAMPAIGN_TYPES} />
            </div>
          </div>
        </Card>

        <Card>
          <Label>Tone (pick up to 3)</Label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {TONES.map(t => {
              const active = tones.includes(t.id);
              return (
                <button key={t.id} onClick={() => toggleTone(t.id)} style={{
                  background: active ? `${t.color}18` : theme.surface,
                  border: `1px solid ${active ? t.color + "60" : theme.border}`,
                  color: active ? t.color : theme.textMuted,
                  padding: "6px 12px", borderRadius: 20, cursor: "pointer",
                  fontSize: 12, fontWeight: active ? 700 : 400,
                  transition: "all 0.2s", fontFamily: "inherit",
                }}>{t.icon} {t.label}</button>
              );
            })}
          </div>
        </Card>

        <Card>
          <Input label="Brand Voice / Keywords" value={brandVoice} onChange={setBrandVoice}
            placeholder="e.g. Conversational, no jargon, mention ROI" multiline rows={2} />
        </Card>

        <Card style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Toggle value={includeEmoji} onChange={setEmoji} label="Include emojis" />
          <Toggle value={includeNumbers} onChange={setNums} label="Include numbers" />
          <div style={{ gridColumn: "1/-1" }}>
            <Label>How many to generate?</Label>
            <div style={{ display: "flex", gap: 6 }}>
              {[3, 5, 6, 8, 10].map(n => (
                <button key={n} onClick={() => setCount(n)} style={{
                  flex: 1, background: count === n ? theme.accentGlow : theme.surface,
                  border: `1px solid ${count === n ? theme.accent : theme.border}`,
                  color: count === n ? theme.accent : theme.textMuted,
                  padding: "8px 0", borderRadius: 10, cursor: "pointer",
                  fontSize: 13, fontWeight: 700, transition: "all 0.2s", fontFamily: "inherit",
                }}>{n}</button>
              ))}
            </div>
          </div>
        </Card>

        <Alert message={error} type="error" />

        <Btn onClick={generate} disabled={loading} size="lg" style={{ width: "100%" }}>
          {loading ? <><Spinner size={16} color="#fff" /> Generating...</> : "✦ Generate Subject Lines"}
        </Btn>
      </div>

      {/* ── RIGHT: Results Panel ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Empty state */}
        {results.length === 0 && !loading && (
          <div style={{
            background: theme.surface, border: `1px dashed ${theme.border}`,
            borderRadius: 20, padding: "72px 32px", textAlign: "center",
          }}>
            <div style={{ fontSize: 52, marginBottom: 14, opacity: 0.35 }}>✉</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: theme.textMuted, marginBottom: 6 }}>Your subject lines appear here</div>
            <div style={{ fontSize: 13, color: theme.textMuted, opacity: 0.7 }}>Fill in the form on the left and hit Generate</div>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div style={{
            background: theme.surface, border: `1px solid ${theme.border}`,
            borderRadius: 20, padding: "72px 32px", textAlign: "center",
          }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><Spinner size={36} /></div>
            <div style={{ color: theme.accent, fontSize: 15, fontWeight: 700 }}>Crafting {count} subject lines...</div>
            <div style={{ color: theme.textMuted, fontSize: 13, marginTop: 6 }}>Analyzing tone, audience & campaign type</div>
          </div>
        )}

        {/* Results */}
        {results.map((item, idx) => (
          <Card key={idx} style={{ animation: `fadeUp 0.3s ease ${idx * 0.06}s both` }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              {/* Index badge */}
              <div style={{
                width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                background: theme.accentGlow, border: `1px solid ${theme.borderHover}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 800, color: theme.accent,
              }}>{idx + 1}</div>

              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Subject */}
                <div style={{ fontSize: 17, fontWeight: 700, color: theme.text, marginBottom: 5, lineHeight: 1.4 }}>
                  {item.subject}
                </div>

                {/* Preview */}
                {item.preview && (
                  <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 10, fontStyle: "italic" }}>
                    ↳ {item.preview}
                  </div>
                )}

                {/* Badges */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 20,
                    color: charColor(item.subject.length, theme),
                    background: `${charColor(item.subject.length, theme)}15`,
                    border: `1px solid ${charColor(item.subject.length, theme)}30`,
                  }}>{item.subject.length}ch · {charLabel(item.subject.length)}</span>
                  <OpenRateBadge rate={item.openRate} />
                  {item.structure && (
                    <span style={{ fontSize: 11, background: theme.surface, color: theme.textMuted, border: `1px solid ${theme.border}`, borderRadius: 20, padding: "2px 10px" }}>
                      {item.structure}
                    </span>
                  )}
                  {item.tone && (
                    <span style={{ fontSize: 11, background: theme.surface, color: theme.textMuted, border: `1px solid ${theme.border}`, borderRadius: 20, padding: "2px 10px" }}>
                      {item.tone}
                    </span>
                  )}
                </div>

                {/* Hook insight */}
                {item.hook && (
                  <div style={{
                    fontSize: 12, color: theme.accent, opacity: 0.85,
                    background: theme.accentGlow, border: `1px solid ${theme.borderHover}`,
                    borderRadius: 8, padding: "7px 12px", marginBottom: 10,
                  }}>
                    💡 {item.hook}
                  </div>
                )}

                {/* Spam meter */}
                <SpamMeter text={item.subject} />

                {/* Star rating */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                  <StarRating value={ratings[idx]} onChange={r => setRatings(p => ({ ...p, [idx]: r }))} />
                  {ratings[idx] && <span style={{ fontSize: 11, color: theme.textMuted }}>{ratings[idx]}/5</span>}
                </div>

                {/* Refined variations */}
                {refined[idx] && (
                  <div style={{
                    marginTop: 12, background: `${theme.accent}08`,
                    border: `1px solid ${theme.borderHover}`, borderRadius: 12, padding: "12px 14px",
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: theme.accent, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
                      ✨ Refined Variations
                    </div>
                    {refined[idx].map((v, i) => (
                      <div key={i} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "7px 0", borderBottom: i < refined[idx].length - 1 ? `1px solid ${theme.border}` : "none",
                      }}>
                        <span style={{ fontSize: 13, color: theme.text }}>{v}</span>
                        <CopyBtn text={v} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                <CopyBtn text={item.subject} />
                <Btn
                  variant={isSaved(item) ? "ghost" : "secondary"}
                  size="sm"
                  onClick={() => !isSaved(item) && onSave({ ...item, rating: ratings[idx] || null })}
                  style={{ color: isSaved(item) ? theme.accent : theme.textMuted }}
                >
                  {isSaved(item) ? "✓ Saved" : "Save"}
                </Btn>
                <Btn
                  variant="secondary" size="sm"
                  onClick={() => refineSubject(item, idx)}
                  disabled={refining === idx}
                >
                  {refining === idx ? <Spinner size={12} /> : "Refine"}
                </Btn>
              </div>
            </div>
          </Card>
        ))}

        {/* Pro Tips */}
        {results.length > 0 && (
          <Card style={{ background: `${theme.accent}06`, border: `1px solid ${theme.borderHover}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: theme.accent, marginBottom: 10 }}>
              📬 Expert Tips for Higher Open Rates
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px" }}>
              {[
                "Keep under 50 chars for mobile previews",
                "Tuesday–Thursday 9–11 AM sees highest opens",
                "Personalize with [First Name] for +22% opens",
                "A/B test 2 variants before full list send",
                "Numbers & specificity beat vague promises",
                "Avoid ALL CAPS — reduces trust signals",
              ].map(tip => (
                <div key={tip} style={{ fontSize: 12, color: theme.textMuted, display: "flex", gap: 7 }}>
                  <span style={{ color: theme.accent, flexShrink: 0 }}>→</span>{tip}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}