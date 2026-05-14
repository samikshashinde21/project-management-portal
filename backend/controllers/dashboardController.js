const User = require("../models/userModel");
const Project = require("../models/projectModel");


// @desc Admin Dashboard
// @route GET /api/dashboard/admin
// @access Admin

const getAdminDashboard = async (req, res) => {
  try {

    const totalUsers = await User.countDocuments({
      role: "user",
    });

    const totalClients = await User.countDocuments({
      role: "client",
    });

    const totalProjects = await Project.countDocuments();

    const completedProjects = await Project.countDocuments({
      status: "completed",
    });

    const recentProjects = await Project.find({})
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalClients,
      totalProjects,
      completedProjects,
      recentProjects,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// @desc Client Dashboard
// @route GET /api/dashboard/client
// @access Client

const getClientDashboard = async (req, res) => {
  try {

    const assignedProjects = await Project.countDocuments({
      assignedClient: req.user._id,
    });

    const completedProjects = await Project.countDocuments({
      assignedClient: req.user._id,
      status: "completed",
    });

    const inProgressProjects = await Project.countDocuments({
      assignedClient: req.user._id,
      status: "in-progress",
    });

    const recentProjects = await Project.find({
      assignedClient: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      assignedProjects,
      completedProjects,
      inProgressProjects,
      recentProjects,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// @desc User Dashboard
// @route GET /api/dashboard/user
// @access User

const getUserDashboard = async (req, res) => {
  try {

    res.json({
      message: `Welcome ${req.user.name}`,
      role: req.user.role,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAdminDashboard,
  getClientDashboard,
  getUserDashboard,
};