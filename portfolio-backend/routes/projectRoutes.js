const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const makeUploader = require('../middleware/upload');
const {
  getProjects, getProject, createProject, updateProject, deleteProject
} = require('../controllers/projectController');

const upload = makeUploader('projects');

router.get('/', getProjects);
router.get('/:id', getProject);
//Admin
router.post('/', protect, upload.array('images', 10), createProject);
router.put('/:id', protect, upload.array('images', 10), updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;
