const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  getExperience, createExperience, updateExperience, deleteExperience
} = require('../controllers/experienceController');

router.get('/', getExperience);
router.post('/', protect, createExperience);
router.put('/:id', protect, updateExperience);
router.delete('/:id', protect, deleteExperience);

module.exports = router;
