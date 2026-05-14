const express = require("express");

const router = express.Router();

const {
  getProjectReports,
} = require("../controllers/reportController");

const {
  protect,
  admin,
} = require("../middleware/authMiddleware");


router.get(
  "/projects",
  protect,
  admin,
  getProjectReports
);

module.exports = router;