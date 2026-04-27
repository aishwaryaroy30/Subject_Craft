import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { historyAPI } from "../../services/api";
import { Card, Spinner } from "../ui";

export default function AnalyticsPage() {
  const { theme } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    historyAPI.getStats()
      .then(res => setStats(res.data))
      .catch(() => setStats({
        totalGenerated: 0, totalSessions: 0,
        avgOpenRate: "0", topTone: "—",
        weeklyData: [
          { day: "Sun", count: 0 }, { day: "Mon", count: 0 },
          { day: "Tue", count: 0 }, { day: "Wed", count: 0 },
          { day: "Thu", count: 0 }, { day: "Fri", count: 0 },
          { day: "Sat", count: 0 },
        ],
      }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
      <Spinner size={32} />
    </div>
  );

  const maxCount = Math.max(...(stats?.weeklyData || []).map(d => d.count), 1);

  const statCards = [
    { label: "Total Generated",  value: stats?.totalGenerated || 0, icon: "✦", color: theme.accent },
    { label: "Sessions",         value: stats?.totalSessions  || 0, icon: "◷", color: theme.blue   },
    { label: "Avg Open Rate",    value: `~${stats?.avgOpenRate || 0}%`, icon: "◈", color: theme.green  },
    { label: "Top Tone",         value: stats?.topTone || "—",      icon: "💼", color: theme.orange },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 4 }}>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, margin: "0 0 8px", color: theme.text }}>
          Analytics Dashboard
        </h2>
        <p style={{ color: theme.textMuted, fontSize: 14, margin: 0 }}>
          Your personal generation stats and performance insights
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
        {statCards.map(s => (
          <Card key={s.label}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                  {s.label}
                </div>
                <div style={{ fontSize: 30, fontWeight: 800, color: s.color, fontFamily: "'Syne',sans-serif", lineHeight: 1 }}>
                  {s.value}
                </div>
              </div>
              <div style={{ fontSize: 22, color: s.color, opacity: 0.4 }}>{s.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Bar chart */}
      <Card>
        <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 20 }}>
          Weekly Generation Activity
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 130, paddingBottom: 4 }}>
          {(stats?.weeklyData || []).map(d => (
            <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 600 }}>{d.count || ""}</div>
              <div style={{
                width: "100%", minHeight: 4,
                background: d.count > 0
                  ? `linear-gradient(180deg, ${theme.accent}, ${theme.accentAlt})`
                  : theme.border,
                borderRadius: "6px 6px 0 0",
                height: `${Math.max((d.count / maxCount) * 100, d.count > 0 ? 8 : 4)}px`,
                transition: "height 0.5s ease", opacity: d.count > 0 ? 0.9 : 0.3,
              }} />
              <div style={{ fontSize: 11, color: theme.textMuted }}>{d.day}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Insight tables */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 14 }}>
            Best Performing Structures
          </div>
          {[["Question-led", "~38% open"], ["Number hook", "~34% open"], ["Emoji-led", "~31% open"], ["Cliffhanger", "~29% open"]].map(([s, r]) => (
            <div key={s} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${theme.border}` }}>
              <span style={{ fontSize: 13, color: theme.textSoft }}>{s}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: theme.green }}>{r}</span>
            </div>
          ))}
        </Card>

        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 14 }}>
            Optimal Send Times
          </div>
          {[["Tuesday 10 AM", "Highest opens"], ["Thursday 9 AM", "2nd best"], ["Wednesday 2 PM", "Mid-week"], ["Friday 11 AM", "Pre-weekend"]].map(([t, n]) => (
            <div key={t} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${theme.border}` }}>
              <span style={{ fontSize: 13, color: theme.textSoft }}>{t}</span>
              <span style={{ fontSize: 11, color: theme.textMuted }}>{n}</span>
            </div>
          ))}
        </Card>

        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 14 }}>
            Character Length Impact
          </div>
          {[["≤ 30 chars", "Highest CTR"], ["31–45 chars", "Recommended"], ["46–55 chars", "Acceptable"], ["56+ chars", "Avoid"]].map(([r, n]) => (
            <div key={r} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${theme.border}` }}>
              <span style={{ fontSize: 13, color: theme.textSoft }}>{r}</span>
              <span style={{ fontSize: 11, color: theme.textMuted }}>{n}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* Industry benchmarks */}
      <Card>
        <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 16 }}>
          Industry Average Open Rates
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "E-commerce",   rate: 18, color: theme.orange },
            { label: "SaaS / Tech",  rate: 22, color: theme.accent },
            { label: "Education",    rate: 28, color: theme.blue   },
            { label: "Healthcare",   rate: 24, color: theme.green  },
            { label: "Non-profit",   rate: 32, color: theme.pink   },
          ].map(({ label, rate, color }) => (
            <div key={label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 13, color: theme.textSoft }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color }}>{rate}%</span>
              </div>
              <div style={{ background: theme.border, borderRadius: 6, height: 7, overflow: "hidden" }}>
                <div style={{ width: `${rate * 2}%`, height: "100%", background: color, borderRadius: 6, transition: "width 0.6s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}