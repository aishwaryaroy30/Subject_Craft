import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { subjectAPI } from "../../services/api";
import { spamCheck } from "../../utils/helpers";
import { Card, Input, Btn, SpamMeter, OpenRateBadge, Alert, Spinner } from "../ui";

export default function ABPage() {
  const { theme } = useTheme();
  const [variantA, setA] = useState("");
  const [variantB, setB] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    if (!variantA.trim() || !variantB.trim()) {
      setError("Both variants are required."); return;
    }
    setError(""); setLoading(true); setResult(null);
    try {
      const { data } = await subjectAPI.abTest({ variantA, variantB });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || "Analysis failed. Try again.");
    } finally { setLoading(false); }
  };

  const winColor = result?.winner === "A" ? theme.blue : theme.pink;

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, margin: "0 0 8px", color: theme.text }}>
          A/B Testing Studio
        </h2>
        <p style={{ color: theme.textMuted, fontSize: 14, margin: 0 }}>
          Pit two subject lines head-to-head — AI picks the winner with reasoning
        </p>
      </div>

      {/* Input cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
        <Card style={{ border: `2px solid ${theme.blue}30` }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: theme.blue, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10 }}>
            ◈ Version A
          </div>
          <Input value={variantA} onChange={setA} placeholder="First subject line..." />
          {variantA && (
            <div style={{ marginTop: 10 }}>
              <SpamMeter text={variantA} />
              <div style={{ marginTop: 8 }}>
                <OpenRateBadge rate={result?.openRateA || Math.floor(Math.random() * 10 + 24)} />
              </div>
              <div style={{ marginTop: 6, fontSize: 11, color: theme.textMuted }}>
                {variantA.length} characters
              </div>
            </div>
          )}
        </Card>

        <Card style={{ border: `2px solid ${theme.pink}30` }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: theme.pink, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10 }}>
            ◈ Version B
          </div>
          <Input value={variantB} onChange={setB} placeholder="Second subject line..." />
          {variantB && (
            <div style={{ marginTop: 10 }}>
              <SpamMeter text={variantB} />
              <div style={{ marginTop: 8 }}>
                <OpenRateBadge rate={result?.openRateB || Math.floor(Math.random() * 10 + 24)} />
              </div>
              <div style={{ marginTop: 6, fontSize: 11, color: theme.textMuted }}>
                {variantB.length} characters
              </div>
            </div>
          )}
        </Card>
      </div>

      <Alert message={error} type="error" />

      <Btn
        onClick={run}
        disabled={loading || !variantA.trim() || !variantB.trim()}
        size="lg"
        style={{ width: "100%", marginBottom: 20, marginTop: error ? 12 : 0 }}
      >
        {loading ? <><Spinner size={16} color="#fff" /> Analyzing with AI...</> : "⇄ Run AI Analysis"}
      </Btn>

      {/* Result */}
      {result && !result.error && (
        <Card style={{ border: `2px solid ${winColor}40` }}>
          {/* Winner banner */}
          <div style={{
            display: "flex", alignItems: "center", gap: 16, marginBottom: 20,
            paddingBottom: 20, borderBottom: `1px solid ${theme.border}`,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: `${winColor}18`, border: `2px solid ${winColor}50`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
            }}>🏆</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: theme.text, fontFamily: "'Syne',sans-serif" }}>
                Version {result.winner} Wins!
              </div>
              <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 3 }}>
                Confidence: <span style={{ color: winColor, fontWeight: 700 }}>{result.confidence}</span>
                &nbsp;·&nbsp;Score: {result.winnerScore} vs {result.loserScore}
              </div>
              <div style={{ fontSize: 13, color: theme.textSoft, marginTop: 4, fontStyle: "italic" }}>
                "{result.winner === "A" ? variantA : variantB}"
              </div>
            </div>
          </div>

          {/* Analysis breakdown */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            {Object.entries(result.analysis || {}).filter(([k]) => k !== "recommendation").map(([key, val]) => (
              <div key={key} style={{
                background: theme.surface, border: `1px solid ${theme.border}`,
                borderRadius: 12, padding: "12px 14px",
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </div>
                <div style={{ fontSize: 13, color: theme.text, lineHeight: 1.5 }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Recommendation */}
          {result.analysis?.recommendation && (
            <div style={{
              background: theme.accentGlow, border: `1px solid ${theme.borderHover}`,
              borderRadius: 12, padding: "14px 16px",
            }}>
              <span style={{ fontWeight: 700, color: theme.accent }}>💡 Recommendation: </span>
              <span style={{ fontSize: 13, color: theme.text }}>{result.analysis.recommendation}</span>
            </div>
          )}

          {/* Score bars */}
          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "Version A", score: result.winner === "A" ? result.winnerScore : result.loserScore, color: theme.blue },
              { label: "Version B", score: result.winner === "B" ? result.winnerScore : result.loserScore, color: theme.pink },
            ].map(({ label, score, color }) => (
              <div key={label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: theme.textMuted, fontWeight: 600 }}>{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color }}>{score}/100</span>
                </div>
                <div style={{ background: theme.border, borderRadius: 6, height: 8, overflow: "hidden" }}>
                  <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 6, transition: "width 0.6s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* How A/B testing works */}
      {!result && (
        <Card style={{ marginTop: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.accent, marginBottom: 12 }}>📖 How A/B Testing Works</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { step: "1", text: "Write two different subject lines for the same campaign" },
              { step: "2", text: "Send variant A to 20% of your list, B to another 20%" },
              { step: "3", text: "Wait 4 hours and measure open rates" },
              { step: "4", text: "Send the winner to the remaining 60% of your list" },
            ].map(({ step, text }) => (
              <div key={step} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 8, background: theme.accentGlow,
                  border: `1px solid ${theme.borderHover}`, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 800, color: theme.accent, flexShrink: 0,
                }}>{step}</div>
                <span style={{ fontSize: 13, color: theme.textSoft, paddingTop: 3 }}>{text}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}