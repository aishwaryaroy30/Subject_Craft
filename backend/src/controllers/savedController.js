const SavedLine = require("../models/SavedLine");

// @GET /api/saved
const getSaved = async (req, res) => {
  try {
    const lines = await SavedLine.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ lines });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch saved lines." });
  }
};

// @POST /api/saved
const saveOne = async (req, res) => {
  try {
    const { subject, preview, tone, hook, structure, openRate, topic, campaignType, industry } = req.body;
    if (!subject) return res.status(400).json({ error: "Subject is required." });

    const line = await SavedLine.create({
      user: req.user._id,
      subject, preview, tone, hook, structure,
      openRate: openRate || 0,
      topic: topic || "", campaignType: campaignType || "", industry: industry || "",
    });
    res.status(201).json({ message: "Saved.", line });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ error: "Already saved." });
    res.status(500).json({ error: "Save failed." });
  }
};

// @PUT /api/saved/:id
const updateSaved = async (req, res) => {
  try {
    const { rating, tags, notes } = req.body;
    const line = await SavedLine.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { rating, tags, notes },
      { new: true }
    );
    if (!line) return res.status(404).json({ error: "Not found." });
    res.json({ line });
  } catch (error) {
    res.status(500).json({ error: "Update failed." });
  }
};

// @DELETE /api/saved/:id
const deleteSaved = async (req, res) => {
  try {
    const line = await SavedLine.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!line) return res.status(404).json({ error: "Not found." });
    res.json({ message: "Removed." });
  } catch (error) {
    res.status(500).json({ error: "Delete failed." });
  }
};

module.exports = { getSaved, saveOne, updateSaved, deleteSaved };