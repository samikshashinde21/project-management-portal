const express = require("express");

const router = express.Router();

const {
  getAdminDashboard,
  getClientDashboard,
  getUserDashboard,
} = require("../controllers/dashboardController");

const {
  protect,
  admin,
} = require("../middleware/authMiddleware");


router.get(
  "/admin",
  protect,
  admin,
  getAdminDashboard
);

router.get(
  "/client",
  protect,
  getClientDashboard
);

router.get(
  "/user",
  protect,
  getUserDashboard
);

module.exports = router;