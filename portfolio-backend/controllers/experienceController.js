const Experience = require('../models/Experience');

// GET /api/experience  (public)
async function getExperience(req, res) {
  try {
    const items = await Experience.find().sort({ order: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch experience', error: err.message });
  }
}

// POST /api/experience  (protected)
async function createExperience(req, res) {
  try {
    const item = new Experience(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create experience entry', error: err.message });
  }
}

// PUT /api/experience/:id  (protected)
async function updateExperience(req, res) {
  try {
    const item = await Experience.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true //added to avoid errors if data is diffrenet from schema
    });
    if (!item) {
      return res.status(404).json({ message: 'Experience entry not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update experience entry', error: err.message });
  }
}

// DELETE /api/experience/:id  (protected)
async function deleteExperience(req, res) {
  try {
    const item = await Experience.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Experience entry not found' });
    }
    res.json({ message: 'Experience entry deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete experience entry', error: err.message });
  }
}

module.exports = { getExperience, createExperience, updateExperience, deleteExperience };
