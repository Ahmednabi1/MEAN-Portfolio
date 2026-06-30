const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const makeUploader = require('../middleware/upload');
const { getProfile, updateProfile } = require('../controllers/profileController');

const upload = makeUploader('profile');

router.get('/', getProfile);
router.put('/', protect, upload.single('profilePicture'), updateProfile);

module.exports = router;
