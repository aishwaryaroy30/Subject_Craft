export const SPAM_WORDS = [
  "free","winner","cash","prize","guaranteed","urgent","act now",
  "limited time","click here","buy now","order now","special promotion",
  "no cost","risk free","earn money","make money","extra income",
  "work from home","congratulations","dear friend","save big",
  "100%","unsubscribe now",
];

export const spamCheck = (text) => {
  if (!text) return { score: 0, triggers: [] };
  const lower = text.toLowerCase();
  const triggers = SPAM_WORDS.filter(w => lower.includes(w));
  const score = Math.min(
    100,
    triggers.length * 20 +
    (text.includes("!") ? 10 : 0) +
    (text === text.toUpperCase() && text.length > 3 ? 30 : 0)
  );
  return { score, triggers };
};

export const charColor = (n, theme) => {
  if (n <= 40) return theme.green;
  if (n <= 55) return theme.yellow;
  return theme.red;
};

export const charLabel = (n) => {
  if (n <= 40) return "✓ Great";
  if (n <= 55) return "~ OK";
  return "✗ Long";
};

export const fmtDate = (ts) =>
  new Date(ts).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

export const exportToCSV = (lines) => {
  const header = "Subject,Preview,Campaign Type,Topic,Industry,Open Rate,Rating,Tags";
  const rows = lines.map(l =>
    `"${l.subject}","${l.preview || ""}","${l.campaignType || ""}","${l.topic || ""}","${l.industry || ""}","~${l.openRate || 0}%","${l.rating || "—"}","${(l.tags || []).join(";")}"`
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = "subjectcraft-saved.csv"; a.click();
  URL.revokeObjectURL(url);
};