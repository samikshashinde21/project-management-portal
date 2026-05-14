const Project = require("../models/projectModel");


// @desc Create project
// @route POST /api/projects
// @access Admin

const createProject = async (req, res) => {
  try {
    const { title, description, assignedClient } = req.body;

    const project = await Project.create({
      title,
      description,
      assignedClient,
      createdBy: req.user._id,
    });

    res.status(201).json(project);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// @desc Get projects
// @route GET /api/projects
// @access Admin / Client

const getProjects = async (req, res) => {
  try {

    let projects;

    if (req.user.role === "admin") {
      projects = await Project.find({})
        .populate("assignedClient", "name email role");

    } else if (req.user.role === "client") {
      projects = await Project.find({
        assignedClient: req.user._id,
      });

    } else {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    res.json(projects);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// @desc Update project status
// @route PUT /api/projects/:id
// @access Admin

const updateProjectStatus = async (req, res) => {
  try {

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    project.status = req.body.status || project.status;

    const updatedProject = await project.save();

    res.json(updatedProject);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// @desc Delete project
// @route DELETE /api/projects/:id
// @access Admin

const deleteProject = async (req, res) => {
  try {

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    await project.deleteOne();

    res.json({
      message: "Project removed",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  updateProjectStatus,
  deleteProject,
};
