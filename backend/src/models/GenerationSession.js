const mongoose = require("mongoose");

const subjectLineSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  preview: { type: String, default: "" },
  tone: { type: String, default: "" },
  hook: { type: String, default: "" },
  structure: { type: String, default: "" },
  openRate: { type: Number, default: 0 },
  spamScore: { type: Number, default: 0 },
  characters: { type: Number, default: 0 },
});

const generationSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  topic: { type: String, required: true },
  audience: { type: String, default: "" },
  industry: { type: String, default: "" },
  campaignType: { type: String, default: "" },
  tones: [String],
  brandVoice: { type: String, default: "" },
  results: [subjectLineSchema],
  totalGenerated: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("GenerationSession", generationSessionSchema);