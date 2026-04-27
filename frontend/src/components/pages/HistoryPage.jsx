import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { historyAPI } from "../../services/api";
import { fmtDate } from "../../utils/helpers";
import { Card, Btn, CopyBtn, Alert, Spinner } from "../ui";

export default function HistoryPage() {
  const { theme } = useTheme();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [expanded, setExpanded] = useState(null);
  const [clearing, setClearing] = useState(false);

  const load = () => {
    setLoading(true);
    historyAPI.getAll()
      .then(res => setSessions(res.data.sessions || []))
      .catch(() => setError("Failed to load history."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const deleteSession = async (id) => {
    try {
      await historyAPI.deleteOne(id);
      setSessions(p => p.filter(s => s._id !== id));
    } catch { setError("Delete failed."); }
  };

  const clearAll = async () => {
    if (!window.confirm("Clear all history? This cannot be undone.")) return;
    setClearing(true);
    try {
      await historyAPI.clearAll();
      setSessions([]);
    } catch { setError("Clear failed."); }
    finally { setClearing(false); }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, margin: "0 0 4px", color: theme.text }}>
            Generation History
          </h2>
          <p style={{ color: theme.textMuted, fontSize: 13, margin: 0 }}>
            {sessions.length} session{sessions.length !== 1 ? "s" : ""} saved
          </p>
        </div>
        {sessions.length > 0 && (
          <Btn variant="danger" size="sm" onClick={clearAll} disabled={clearing}>
            {clearing ? <Spinner size={12} /> : "Clear All"}
          </Btn>
        )}
      </div>

      <Alert message={error} type="error" />

      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
          <Spinner size={30} />
        </div>
      )}

      {!loading && sessions.length === 0 && (
        <div style={{
          background: theme.surface, border: `1px dashed ${theme.border}`,
          borderRadius: 20, padding: "72px 32px", textAlign: "center",
          color: theme.textMuted,
        }}>
          <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>◷</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>No history yet</div>
          <div style={{ fontSize: 13 }}>Generate some subject lines to see your sessions here.</div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {sessions.map(session => (
          <Card key={session._id}>
            {/* Session header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: expanded === session._id ? 16 : 0 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 4, wordBreak: "break-word" }}>
                  {session.topic}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  <span style={{ fontSize: 11, background: theme.accentGlow, color: theme.accent, border: `1px solid ${theme.borderHover}`, borderRadius: 20, padding: "2px 9px" }}>
                    {session.campaignType}
                  </span>
                  <span style={{ fontSize: 11, background: theme.surface, color: theme.textMuted, border: `1px solid ${theme.border}`, borderRadius: 20, padding: "2px 9px" }}>
                    {session.industry}
                  </span>
                  {session.tones?.slice(0, 2).map(t => (
                    <span key={t} style={{ fontSize: 11, background: theme.surface, color: theme.textMuted, border: `1px solid ${theme.border}`, borderRadius: 20, padding: "2px 9px" }}>
                      {t}
                    </span>
                  ))}
                  <span style={{ fontSize: 11, color: theme.accent, fontWeight: 700 }}>
                    {session.totalGenerated} lines
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 12, flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: theme.textMuted, textAlign: "right" }}>
                  {fmtDate(session.createdAt)}
                </span>
                <Btn variant="ghost" size="sm" onClick={() => setExpanded(p => p === session._id ? null : session._id)}>
                  {expanded === session._id ? "Hide" : "View"}
                </Btn>
                <Btn variant="danger" size="sm" onClick={() => deleteSession(session._id)}>✕</Btn>
              </div>
            </div>

            {/* Expanded results */}
            {expanded === session._id && (
              <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: 14 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {session.results?.map((r, i) => (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      background: theme.surface, borderRadius: 10, padding: "10px 14px",
                    }}>
                      <div>
                        <div style={{ fontSize: 13, color: theme.text, fontWeight: 500, marginBottom: 2 }}>{r.subject}</div>
                        {r.preview && <div style={{ fontSize: 11, color: theme.textMuted, fontStyle: "italic" }}>↳ {r.preview}</div>}
                        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                          <span style={{ fontSize: 10, color: theme.textMuted }}>{r.characters} chars</span>
                          <span style={{ fontSize: 10, color: theme.green }}>~{r.openRate}% open rate</span>
                          {r.tone && <span style={{ fontSize: 10, color: theme.textMuted }}>{r.tone}</span>}
                        </div>
                      </div>
                      <CopyBtn text={r.subject} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}