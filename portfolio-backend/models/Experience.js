const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    dateRange: { type: String, required: true },   // "Jul 2024 – Sep 2024"
    description: { type: String, required: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Experience', experienceSchema);
