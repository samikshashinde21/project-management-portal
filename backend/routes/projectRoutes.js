const express = require("express");

const router = express.Router();

const {
  createProject,
  getProjects,
  updateProjectStatus,
  deleteProject,
} = require("../controllers/projectController");

const {
  protect,
  admin,
} = require("../middleware/authMiddleware");


router.post("/", protect, admin, createProject);

router.get("/", protect, getProjects);

router.put("/:id", protect, admin, updateProjectStatus);

router.delete("/:id", protect, admin, deleteProject);

module.exports = router;
