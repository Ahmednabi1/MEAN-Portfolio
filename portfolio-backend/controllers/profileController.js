const fs = require('fs');
const path = require('path');
const Profile = require('../models/Profile');

//there must exist one profile so in case first run without seeding a blank profile will be created
//helper function no routes for it
async function getOrCreateProfile() {
  let profile = await Profile.findOne();
  if (!profile) {
    profile = await Profile.create({});
  }
  return profile;
}

// GET /api/profile  (public)
async function getProfile(req, res) {
  try {
    const profile = await getOrCreateProfile();
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
}

// PUT /api/profile  (protected)
// Accepts a flat or nested body; education fields can be sent as education.degree etc.
// or as a JSON string under "education".
async function updateProfile(req, res) {
  try {
    const profile = await getOrCreateProfile();

    const fields = [
      'fullName', 'heroEyebrow', 'heroSubtitle',
      'email', 'phone', 'location', 'graduationInfo', 'role',
      'linkedinUrl', 'githubUrl', 'resumeDownloadUrl', 'resumeViewUrl'
    ];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) profile[f] = req.body[f];
    });

    if (req.body.aboutParagraphs !== undefined) {

      // data can arrive as a stringified JSON array or as an actual array so handle both cases.      
      if (typeof req.body.aboutParagraphs === 'string') {
        profile.aboutParagraphs = JSON.parse(req.body.aboutParagraphs);
      } else {
        // Otherwise, it is already an array.
        profile.aboutParagraphs = req.body.aboutParagraphs;
      }

    }

    if (req.body.education !== undefined) {

      let education;

      // If education was sent as a JSON string convert to object
      if (typeof req.body.education === 'string') {
        education = JSON.parse(req.body.education);
      } else {
        education = req.body.education;
      }

      // merge the new education values with the existing ones.
      profile.education = {
        ...profile.education.toObject(),
        ...education
      };

    }

    if (req.file) {
      if (profile.profilePicture) {
        const oldPath = path.join(__dirname, '..', profile.profilePicture);
        fs.unlink(oldPath, () => { });
      }
      profile.profilePicture = `/uploads/profile/${req.file.filename}`;
    }

    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update profile', error: err.message });
  }
}

module.exports = { getProfile, updateProfile };
