import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { savedAPI } from "../../services/api";
import { fmtDate, exportToCSV } from "../../utils/helpers";
import { Card, Btn, CopyBtn, SpamMeter, OpenRateBadge, StarRating, Alert, Spinner } from "../ui";

export default function SavedPage({ saved, setSaved }) {
  const { theme } = useTheme();
  const [tagInput, setTagInput]   = useState({});
  const [editing, setEditing]     = useState(null);
  const [noteInput, setNoteInput] = useState({});
  const [error, setError]         = useState("");

  const updateItem = async (id, data) => {
    try {
      const res = await savedAPI.update(id, data);
      setSaved(p => p.map(s => s._id === id ? res.data.line : s));
    } catch { setError("Update failed."); }
  };

  const removeItem = async (id) => {
    try {
      await savedAPI.delete(id);
      setSaved(p => p.filter(s => s._id !== id));
    } catch { setError("Remove failed."); }
  };

  const addTag = async (item) => {
    const tag = tagInput[item._id]?.trim();
    if (!tag) return;
    const newTags = [...(item.tags || []), tag];
    await updateItem(item._id, { tags: newTags });
    setTagInput(p => ({ ...p, [item._id]: "" }));
  };

  const removeTag = async (item, tag) => {
    const newTags = (item.tags || []).filter(t => t !== tag);
    await updateItem(item._id, { tags: newTags });
  };

  const saveNote = async (item) => {
    await updateItem(item._id, { notes: noteInput[item._id] || "" });
    setEditing(null);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, margin: "0 0 4px", color: theme.text }}>
            Saved Lines
          </h2>
          <p style={{ color: theme.textMuted, fontSize: 13, margin: 0 }}>
            {saved.length} subject line{saved.length !== 1 ? "s" : ""} saved
          </p>
        </div>
        {saved.length > 0 && (
          <Btn variant="success" size="sm" onClick={() => exportToCSV(saved)}>
            ⬇ Export CSV
          </Btn>
        )}
      </div>

      <Alert message={error} type="error" />

      {saved.length === 0 && (
        <div style={{
          background: theme.surface, border: `1px dashed ${theme.border}`,
          borderRadius: 20, padding: "72px 32px", textAlign: "center", color: theme.textMuted,
        }}>
          <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>◆</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Nothing saved yet</div>
          <div style={{ fontSize: 13 }}>Hit "Save" on any generated subject line to collect them here.</div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {saved.map(item => (
          <Card key={item._id}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Subject */}
                <div style={{ fontSize: 17, fontWeight: 700, color: theme.text, marginBottom: 5, lineHeight: 1.4, wordBreak: "break-word" }}>
                  {item.subject}
                </div>

                {/* Preview */}
                {item.preview && (
                  <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 8, fontStyle: "italic" }}>
                    ↳ {item.preview}
                  </div>
                )}

                {/* Badges */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                  <OpenRateBadge rate={item.openRate} />
                  {item.campaignType && (
                    <span style={{ fontSize: 11, background: theme.accentGlow, color: theme.accent, border: `1px solid ${theme.borderHover}`, borderRadius: 20, padding: "2px 9px" }}>
                      {item.campaignType}
                    </span>
                  )}
                  {item.industry && (
                    <span style={{ fontSize: 11, background: theme.surface, color: theme.textMuted, border: `1px solid ${theme.border}`, borderRadius: 20, padding: "2px 9px" }}>
                      {item.industry}
                    </span>
                  )}
                  <span style={{ fontSize: 11, color: theme.textMuted }}>{fmtDate(item.createdAt)}</span>
                </div>

                {/* Spam meter */}
                <SpamMeter text={item.subject} />

                {/* Star rating */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                  <StarRating
                    value={item.rating}
                    onChange={r => updateItem(item._id, { rating: r })}
                  />
                  {item.rating && <span style={{ fontSize: 11, color: theme.textMuted }}>{item.rating}/5</span>}
                </div>

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10, alignItems: "center" }}>
                  {(item.tags || []).map(tag => (
                    <span key={tag} style={{
                      fontSize: 11, background: theme.accentGlow, color: theme.accent,
                      border: `1px solid ${theme.borderHover}`, borderRadius: 20,
                      padding: "2px 10px", display: "flex", alignItems: "center", gap: 4,
                    }}>
                      #{tag}
                      <button onClick={() => removeTag(item, tag)} style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: theme.accent, fontSize: 10, padding: 0, lineHeight: 1,
                      }}>✕</button>
                    </span>
                  ))}
                  <input
                    value={tagInput[item._id] || ""}
                    onChange={e => setTagInput(p => ({ ...p, [item._id]: e.target.value }))}
                    onKeyDown={e => e.key === "Enter" && addTag(item)}
                    placeholder="+ add tag"
                    style={{
                      background: "transparent", border: `1px dashed ${theme.borderHover}`,
                      borderRadius: 20, padding: "2px 10px", fontSize: 11,
                      color: theme.accent, width: 80, outline: "none", fontFamily: "inherit",
                    }}
                  />
                </div>

                {/* Notes */}
                {editing === item._id ? (
                  <div style={{ marginTop: 10 }}>
                    <textarea
                      value={noteInput[item._id] ?? item.notes ?? ""}
                      onChange={e => setNoteInput(p => ({ ...p, [item._id]: e.target.value }))}
                      placeholder="Add a note..."
                      rows={2}
                      style={{
                        width: "100%", background: theme.inputBg, border: `1px solid ${theme.borderHover}`,
                        borderRadius: 10, padding: "8px 12px", color: theme.text, fontSize: 13,
                        fontFamily: "inherit", outline: "none", resize: "none", boxSizing: "border-box",
                      }}
                    />
                    <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                      <Btn variant="primary" size="sm" onClick={() => saveNote(item)}>Save Note</Btn>
                      <Btn variant="secondary" size="sm" onClick={() => setEditing(null)}>Cancel</Btn>
                    </div>
                  </div>
                ) : (
                  item.notes && (
                    <div style={{
                      marginTop: 10, fontSize: 12, color: theme.textMuted,
                      background: theme.surface, borderRadius: 8, padding: "7px 12px",
                      fontStyle: "italic",
                    }}>
                      📝 {item.notes}
                    </div>
                  )
                )}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                <CopyBtn text={item.subject} />
                <Btn variant="secondary" size="sm" onClick={() => {
                  setEditing(item._id);
                  setNoteInput(p => ({ ...p, [item._id]: item.notes || "" }));
                }}>
                  {item.notes ? "Edit Note" : "Add Note"}
                </Btn>
                <Btn variant="danger" size="sm" onClick={() => removeItem(item._id)}>Remove</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}