const mongoose = require('mongoose');

const skillCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },   // "Backend Development"
    icon: { type: String, default: 'fas fa-code' },        // font-awesome class
    tags: [{ type: String, trim: true }],                  // ["Node.js", "Express.js"]
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SkillCategory', skillCategorySchema);
