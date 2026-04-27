const axios = require("axios");
const GenerationSession = require("../models/GenerationSession");
const { callAI, parseJSONArray, parseJSONObject } = require("../services/aiService");
// ── Spam word list ────────────────────────────────────────────
const SPAM_WORDS = [
  "free","winner","cash","prize","guaranteed","urgent","act now",
  "limited time","click here","buy now","order now","special promotion",
  "you've been selected","no cost","risk free","earn money","make money",
  "extra income","work from home","congratulations","dear friend",
  "save big","100%","unsubscribe now",
];

const spamCheck = (text) => {
  if (!text) return { score: 0, triggers: [] };
  const lower = text.toLowerCase();
  const triggers = SPAM_WORDS.filter(w => lower.includes(w));
  const score = Math.min(100,
    triggers.length * 20 +
    (text.includes("!") ? 10 : 0) +
    (text === text.toUpperCase() && text.length > 3 ? 30 : 0)
  );
  return { score, triggers };
};

const estimateOpenRate = (subject, tones = []) => {
  let base = 22;
  const len = subject.length;
  if (len <= 40) base += 8;
  if (len <= 30) base += 4;
  if (/\d/.test(subject)) base += 3;
  if (/[?]/.test(subject)) base += 4;
  if (/[\u{1F300}-\u{1FFFF}]/u.test(subject)) base += 3;
  if (tones.includes("curiosity") || tones.includes("fomo")) base += 5;
  const { score } = spamCheck(subject);
  base -= Math.floor(score / 10);
  return Math.max(8, Math.min(58, base));
};

// ── @POST /api/subjects/generate ─────────────────────────────
const generate = async (req, res) => {
  try {
    const {
      topic, audience, industry, campaignType,
      tones, count, brandVoice, includeEmoji, includeNumbers
    } = req.body;

    if (!topic?.trim()) {
      return res.status(400).json({ error: "Campaign topic is required." });
    }

    const toneLabels = (tones || ["Professional"]).join(", ");

    const prompt = `You are a world-class email marketing strategist and copywriter.

Generate exactly ${count || 6} high-converting email subject lines.

Campaign Brief:
- Topic/Product: ${topic}
- Target Audience: ${audience || "General audience"}
- Industry: ${industry || "General"}
- Campaign Type: ${campaignType || "Newsletter"}
- Desired Tones: ${toneLabels}
- Brand Voice Notes: ${brandVoice || "None"}
- Use Emojis: ${includeEmoji ? "Yes, 1-2 subject lines should start with relevant emojis" : "No emojis"}
- Use Numbers: ${includeNumbers ? "Yes, include numbers in 1-2 subject lines where natural" : "Avoid numbers"}

Requirements:
- Mix different structural formats: questions, statements, numbers, how-to, cliffhangers
- Each must be under 60 characters
- Preview text should complement not repeat the subject
- Vary opening word/hook across all results
- Think: what would make a busy professional stop scrolling?

Return ONLY a JSON array, no markdown, no explanation:
[{"subject":"...","preview":"...","tone":"tone name","hook":"why this works in 1 sentence","structure":"Question|Number|Statement|Emoji-led|Cliffhanger|How-to"}]`;

    const text = await callAI(prompt);
    const parsed = parseJSONArray(text);

    if (!parsed.length) {
      return res.status(500).json({ error: "Failed to parse AI response. Try again." });
    }

    // Enrich with server-side metrics
    const enriched = parsed.map(r => ({
      ...r,
      openRate: estimateOpenRate(r.subject, tones || []),
      spamScore: spamCheck(r.subject).score,
      characters: r.subject?.length || 0,
    }));

    // Save session to DB
    const session = await GenerationSession.create({
      user: req.user._id,
      topic,
      audience: audience || "",
      industry: industry || "",
      campaignType: campaignType || "",
      tones: tones || [],
      brandVoice: brandVoice || "",
      results: enriched,
      totalGenerated: enriched.length,
    });

    res.json({ sessionId: session._id, results: enriched });
  } catch (error) {
    console.error("Generate error:", error.message);
    res.status(500).json({ error: "Generation failed. Check your API key and try again." });
  }
};

// ── @POST /api/subjects/refine ────────────────────────────────
const refine = async (req, res) => {
  try {
    const { subject, hook, campaignType } = req.body;
    if (!subject) return res.status(400).json({ error: "Subject is required." });

    const prompt = `You are an expert email copywriter. Take this subject line and generate 3 improved variations.

Original: "${subject}"
Campaign Type: ${campaignType || "General"}
Hook insight: ${hook || "Make it compelling"}

Rules:
- Keep the same core message/intent
- Try different structures for each variation
- Each must be under 60 characters
- Make each meaningfully different, not just rephrased

Return ONLY a JSON array of 3 strings: ["variation 1","variation 2","variation 3"]`;

    const text = await callAI(prompt, 400);
    const clean = text.replace(/```json|```/g, "").trim();
    const variations = JSON.parse(clean);

    res.json({ variations });
  } catch (error) {
    res.status(500).json({ error: "Refinement failed." });
  }
};

// ── @POST /api/subjects/ab-test ───────────────────────────────
const abTest = async (req, res) => {
  try {
    const { variantA, variantB } = req.body;
    if (!variantA?.trim() || !variantB?.trim()) {
      return res.status(400).json({ error: "Both variants are required." });
    }

    const prompt = `You are an email marketing conversion expert. Analyze these two subject lines:

A: "${variantA}"
B: "${variantB}"

Evaluate on: open rate potential, clarity, emotional hook, length, curiosity gap, spam risk.
Pick a winner and explain why.

Return ONLY JSON (no markdown):
{"winner":"A or B","confidence":"High|Medium|Low","winnerScore":85,"loserScore":72,"analysis":{"openRate":"...","clarity":"...","hook":"...","spamRisk":"...","recommendation":"..."}}`;

    const text = await callAI(prompt, 600);
    const result = parseJSONObject(text);

    if (!result) return res.status(500).json({ error: "Analysis failed. Try again." });

    // Attach spam scores
    result.spamA = spamCheck(variantA);
    result.spamB = spamCheck(variantB);
    result.openRateA = estimateOpenRate(variantA);
    result.openRateB = estimateOpenRate(variantB);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "A/B test failed." });
  }
};

module.exports = { generate, refine, abTest };