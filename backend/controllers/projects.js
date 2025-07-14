const Project = require('../models/Project');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = asyncHandler(async (req, res, next) => {
  // Check if user is admin or manager
  if (req.user.role === 'admin') {
    const projects = await Project.find().populate('manager members');
    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } else if (req.user.role === 'manager') {
    const projects = await Project.find({ 
      $or: [{ manager: req.user.id }, { members: req.user.id }] 
    }).populate('manager members');
    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } else {
    const projects = await Project.find({ members: req.user.id }).populate('manager members');
    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  }
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id).populate('manager members');

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is project member, manager or admin
  if (
    project.manager._id.toString() !== req.user.id &&
    !project.members.some(member => member._id.toString() === req.user.id) &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(`User not authorized to access this project`, 401)
    );
  }

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Create project
// @route   POST /api/projects
// @access  Private
exports.createProject = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.manager = req.user.id;

  const project = await Project.create(req.body);

  res.status(201).json({
    success: true,
    data: project
  });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = asyncHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is project manager or admin
  if (project.manager.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User not authorized to update this project`, 401)
    );
  }

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is project manager or admin
  if (project.manager.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User not authorized to delete this project`, 401)
    );
  }

  await project.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private
exports.addMember = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is project manager or admin
  if (project.manager.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User not authorized to add members to this project`, 401)
    );
  }

  // Check if member already exists
  if (project.members.includes(req.body.userId)) {
    return next(
      new ErrorResponse(`User is already a member of this project`, 400)
    );
  }

  project.members.push(req.body.userId);
  await project.save();

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private
exports.removeMember = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is project manager or admin
  if (project.manager.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User not authorized to remove members from this project`, 401)
    );
  }

  // Check if member exists
  const memberIndex = project.members.indexOf(req.params.userId);
  if (memberIndex === -1) {
    return next(
      new ErrorResponse(`User is not a member of this project`, 400)
    );
  }

  project.members.splice(memberIndex, 1);
  await project.save();

  res.status(200).json({
    success: true,
    data: project
  });
});