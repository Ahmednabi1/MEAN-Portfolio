const fs = require('fs');
const path = require('path');
const Project = require('../models/Project');

// GET /api/projects  (public)
async function getProjects(req, res) {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch projects', error: err.message });
  }
}

// GET /api/projects/:id  (public)
async function getProject(req, res) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch project', error: err.message });
  }
}

// POST /api/projects  (protected)
async function createProject(req, res) {
  try {
    const { title, description, badge, order } = req.body;

    let techStack;
    let links;

    if (req.body.techStack) {
      techStack = JSON.parse(req.body.techStack);
    } else {
      techStack = [];
    }

    if (req.body.links) {
      links = JSON.parse(req.body.links);
    } else {
      links = [];
    }

    const images = (req.files || []).map((f) => `/uploads/projects/${f.filename}`);

    const project = new Project({
      title,
      description,
      badge,
      techStack,
      links,
      order: order || 0,
      images
    });

    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create project', error: err.message });
  }
}

// PUT /api/projects/:id  (protected)
// any newly uploaded images are appended to the existing array.
// to remove specific existing images, send "removeImages" as a JSON array of the image path to be deleted.
//  - To reorder/replace the whole array send the "images" as a JSON array of paths to keep the order instead of uploading files again.
async function updateProject(req, res) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const { title, description, badge, order } = req.body;
    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (badge !== undefined) project.badge = badge;
    if (order !== undefined) project.order = order;
    if (req.body.techStack !== undefined) project.techStack = JSON.parse(req.body.techStack);
    if (req.body.links !== undefined) project.links = JSON.parse(req.body.links);

    // remove specific existing images (delete from file + array)
    if (req.body.removeImages) {
      const toBeRemoved = JSON.parse(req.body.removeImages);
      toBeRemoved.forEach((imgPath) => {const fullPath = path.join(__dirname, '..', imgPath);
        fs.unlink(fullPath, () => { });
      });
      project.images = project.images.filter((img) => !toBeRemoved.includes(img));
    }

    // in case "images" was sent as a JSON string array (not files) treat it as the ordered list of paths.
    if (req.body.images !== undefined && typeof req.body.images === 'string') {
      try {
        const parsed = JSON.parse(req.body.images);
        if (Array.isArray(parsed)) {
          project.images = parsed;
        }
      } catch {
      }
    }

    //append any newly uploaded files
    if (req.files && req.files.length > 0) {
      const newPaths = req.files.map((f) => `/uploads/projects/${f.filename}`);
      project.images = [...project.images, ...newPaths];
    }

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update project', error: err.message });
  }
}

// DELETE /api/projects/:id  (protected) — deletes the project and all its images along with it.
async function deleteProject(req, res) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    (project.images || []).forEach((imgPath) => {
      const fullPath = path.join(__dirname, '..', imgPath);
      fs.unlink(fullPath, () => { });
    });

    await project.deleteOne();
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete project', error: err.message });
  }
}

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject };
