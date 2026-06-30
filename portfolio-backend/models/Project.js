const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    images: [{ type: String }],                     // stored paths (first item is the cover image)
    badge: { type: String, default: '' },           
    techStack: [{ type: String, trim: true }],
    links: [
      {
        label: { type: String, required: true },     // "LinkedIn", "GitHub"
        url: { type: String, required: true }
      }
    ],
    order: { type: Number, default: 0 }              // controls display order
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
