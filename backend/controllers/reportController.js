const Project = require("../models/projectModel");


// @desc Get project reports
// @route GET /api/reports/projects
// @access Admin

const getProjectReports = async (req, res) => {
  try {

    const {
      startDate,
      endDate,
      filterBy = "project-period",
    } = req.query;

    let filter = {};

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return res.status(400).json({
          message: "Invalid report date range",
        });
      }

      if (start > end) {
        return res.status(400).json({
          message: "Start date cannot be after end date",
        });
      }

      if (filterBy === "deadline") {
        filter.deadline = {
          $gte: start,
          $lte: end,
        };
      } else if (filterBy === "assigned-date") {
        filter.assignedDate = {
          $gte: start,
          $lte: end,
        };
      } else {
        filter.assignedDate = {
          $gte: start,
        };

        filter.deadline = {
          $lte: end,
        };
      }
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
