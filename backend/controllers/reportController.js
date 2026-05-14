const Project = require("../models/projectModel");


// @desc Get project reports
// @route GET /api/reports/projects
// @access Admin

const getProjectReports = async (req, res) => {
  try {

    const { startDate, endDate } = req.query;

    let filter = {};

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const projects = await Project.find(filter)
      .populate("assignedClient", "name email");

    const totalProjects = projects.length;

    const pendingProjects = projects.filter(
      (project) => project.status === "pending"
    ).length;

    const inProgressProjects = projects.filter(
      (project) => project.status === "in-progress"
    ).length;

    const completedProjects = projects.filter(
      (project) => project.status === "completed"
    ).length;

    res.json({
      totalProjects,
      pendingProjects,
      inProgressProjects,
      completedProjects,
      projects,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getProjectReports,
};