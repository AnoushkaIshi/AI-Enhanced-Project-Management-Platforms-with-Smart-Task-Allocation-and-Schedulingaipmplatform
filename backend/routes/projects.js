const express = require('express');
const router = express.Router();


const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Project', ProjectSchema);
// Mock project data
const projects = [
  {
    id: 1,
    name: "AI Project",
    description: "Project management platform"
  }
];

// Get single project
router.get('/:id', (req, res) => {
  const project = projects.find(p => p.id === parseInt(req.params.id));
  res.json({ success: true, data: project });
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: "Test endpoint works!" });
});
// GET all projects
router.get('/', (req, res) => {
  try {
    // Verify authorization header exists
    if (!req.headers.authorization) {
      return res.status(401).json({ error: "Authorization token required" });
    }
    
    res.json({
      success: true,
      data: projects
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;