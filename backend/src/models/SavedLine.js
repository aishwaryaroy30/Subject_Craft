const mongoose = require("mongoose");

const savedLineSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subject: { type: String, required: true },
  preview: { type: String, default: "" },
  tone: { type: String, default: "" },
  hook: { type: String, default: "" },
  structure: { type: String, default: "" },
  openRate: { type: Number, default: 0 },
  topic: { type: String, default: "" },
  campaignType: { type: String, default: "" },
  industry: { type: String, default: "" },
  rating: { type: Number, min: 1, max: 5, default: null },
  tags: [String],
  notes: { type: String, default: "" },
}, { timestamps: true });

// prevent duplicate saves per user
savedLineSchema.index({ user: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model("SavedLine", savedLineSchema);