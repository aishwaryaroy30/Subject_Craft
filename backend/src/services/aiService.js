const axios = require("axios");

// ── OpenRouter API Call ──────────────────────────────────────
const callAI = async (prompt, maxTokens = 1500) => {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: maxTokens,
      temperature: 0.8,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "SubjectCraft Pro",
      },
    }
  );

  return response.data?.choices?.[0]?.message?.content || "";
};

// ── Parse JSON Array ──────────────────────────────────────────
const parseJSONArray = (text) => {
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    const start = clean.indexOf("[");
    const end = clean.lastIndexOf("]");
    return JSON.parse(clean.slice(start, end + 1));
  } catch {
    return [];
  }
};

// ── Parse JSON Object ─────────────────────────────────────────
const parseJSONObject = (text) => {
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    return JSON.parse(clean.slice(start, end + 1));
  } catch {
    return null;
  }
};

module.exports = {
  callAI,
  parseJSONArray,
  parseJSONObject,
};