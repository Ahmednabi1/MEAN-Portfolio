const mongoose = require('mongoose');

// this is a SINGLETON collection — only one document(record) should exist.
const profileSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, default: 'Ahmed Nabil Abdeldhady' },
    heroEyebrow: { type: String, default: 'Backend-Focused Full Stack Developer' },
    heroSubtitle: { type: String, default: 'Node.js · NestJS · PostgreSQL · MongoDB' },
    aboutParagraphs: [{ type: String }],

    profilePicture: { type: String, default: '' }, // /uploads/profile/xyz.jpg

    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    graduationInfo: { type: String, default: '' },
    role: { type: String, default: 'Backend Developer' },

    linkedinUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },

    education: {
      degree: { type: String, default: '' },
      institution: { type: String, default: '' },
      meta: { type: String, default: '' }, // "Major | Graduated | GPA"
      achievementTitle: { type: String, default: '' },
      achievementItems: [{ type: String }],
      achievementDescription: { type: String, default: '' }
    },

    resumeDownloadUrl: { type: String, default: '' },
    resumeViewUrl: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
