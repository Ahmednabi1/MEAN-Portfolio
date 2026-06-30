const SkillCategory = require('../models/SkillCategory');

// GET /api/skills  (public)
async function getSkills(req, res) {
  try {
    const skills = await SkillCategory.find().sort({ order: 1 });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch skills', error: err.message });
  }
}

// POST /api/skills  (protected)
// Body: { name, icon, tags: [...], order }
async function createSkill(req, res) {
  try {
    const skill = new SkillCategory(req.body);
    await skill.save();
    res.status(201).json(skill);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create skill category', error: err.message });
  }
}

// PUT /api/skills/:id  (protected)
async function updateSkill(req, res) {
  try {
    const skill = await SkillCategory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!skill) {
      return res.status(404).json({ message: 'Skill category not found' });
    }
    res.json(skill);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update skill category', error: err.message });
  }
}

// DELETE /api/skills/:id  (protected)
async function deleteSkill(req, res) {
  try {
    const skill = await SkillCategory.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill category not found' });
    }
    res.json({ message: 'Skill category deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete skill category', error: err.message });
  }
}

module.exports = { getSkills, createSkill, updateSkill, deleteSkill };
