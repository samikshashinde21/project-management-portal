const Project = require("../models/projectModel");


// @desc Create project
// @route POST /api/projects
// @access Admin

const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      assignedClient,
      assignedDate,
      deadline,
      status,
    } = req.body;

    const project = await Project.create({
      title,
      description,
      assignedClient,
      assignedDate,
      deadline,
      status:
        status || "pending",
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


// @desc Update project
// @route PUT /api/projects/:id
// @access Admin / Assigned Client

const updateProject = async (req, res) => {
  try {

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (req.user.role === "client") {
      if (
        project.assignedClient.toString() !==
        req.user._id.toString()
      ) {
        return res.status(401).json({
          message: "Not authorized",
        });
      }

      project.status = req.body.status || project.status;
    } else if (req.user.role === "admin") {
      project.title = req.body.title || project.title;

      project.description =
        req.body.description || project.description;

      project.assignedClient =
        req.body.assignedClient || project.assignedClient;

      project.assignedDate =
        req.body.assignedDate || project.assignedDate;

      project.deadline =
        req.body.deadline || project.deadline;

      project.status = req.body.status || project.status;
    } else {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    const updatedProject = await project.save();

    const populatedProject = await updatedProject.populate(
      "assignedClient",
      "name email role"
    );

    res.json(populatedProject);

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
  updateProject,
  deleteProject,
};
