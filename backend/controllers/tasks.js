const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const axios = require('axios');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = asyncHandler(async (req, res, next) => {
  if (req.params.projectId) {
    // Get tasks for specific project
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo project');
    
    return res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } else {
    // Get all tasks for user
    const projects = await Project.find({
      $or: [{ manager: req.user.id }, { members: req.user.id }]
    });
    
    const projectIds = projects.map(project => project._id);
    
    const tasks = await Task.find({ project: { $in: projectIds } })
      .populate('assignedTo project');
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  }
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id).populate('assignedTo project');

  if (!task) {
    return next(
      new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is project member, manager or admin
  const project = await Project.findById(task.project);
  
  if (
    project.manager.toString() !== req.user.id &&
    !project.members.includes(req.user.id) &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(`User not authorized to access this task`, 401)
    );
  }

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
exports.createTask = asyncHandler(async (req, res, next) => {
  // Add project to req.body
  req.body.project = req.params.projectId;

  const project = await Project.findById(req.body.project);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.body.project}`, 404)
    );
  }

  // Make sure user is project manager or admin
  if (project.manager.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User not authorized to add tasks to this project`, 401)
    );
  }

  const task = await Task.create(req.body);

  res.status(201).json({
    success: true,
    data: task
  });
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(
      new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is project manager or admin
  const project = await Project.findById(task.project);
  
  if (project.manager.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User not authorized to update this task`, 401)
    );
  }

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(
      new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is project manager or admin
  const project = await Project.findById(task.project);
  
  if (project.manager.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User not authorized to delete this task`, 401)
    );
  }

  await task.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Assign task
// @route   PUT /api/tasks/:id/assign
// @access  Private
exports.assignTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id).populate('project');

  if (!task) {
    return next(
      new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is project manager or admin
  if (task.project.manager.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User not authorized to assign this task`, 401)
    );
  }

  // Check if user is project member
  const project = await Project.findById(task.project);
  if (!project.members.includes(req.body.userId)) {
    return next(
      new ErrorResponse(`User is not a member of this project`, 400)
    );
  }

  task.assignedTo = req.body.userId;
  await task.save();

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Get AI recommendations for task assignment
// @route   GET /api/tasks/:id/recommendations
// @access  Private
exports.getRecommendations = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id).populate('project');
  
  if (!task) {
    return next(
      new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is project manager or admin
  if (task.project.manager.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User not authorized to get recommendations for this task`, 401)
    );
  }

  // Get project members with their skills
  const members = await User.find({ 
    _id: { $in: task.project.members },
    skills: { $exists: true, $not: { $size: 0 } }
  }).select('firstName lastName skills');

  if (members.length === 0) {
    return next(
      new ErrorResponse(`No members with skills found for this project`, 404)
    );
  }

  try {
    // Call AI service
    const response = await axios.post('http://localhost:5001/recommend', {
      task_description: task.description || task.title,
      potential_assignees: members.map(member => ({
        id: member._id.toString(),
        name: `${member.firstName} ${member.lastName}`,
        skills: member.skills
      }))
    });

    res.status(200).json({
      success: true,
      data: response.data
    });
  } catch (err) {
    console.error(err);
    return next(
      new ErrorResponse(`Error getting recommendations from AI service`, 500)
    );
  }
});