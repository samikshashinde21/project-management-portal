const express = require("express");

const router = express.Router();

const {
  getSettings,
  updateSettings,
  changePassword,
} = require("../controllers/settingsController");

const {
  protect,
  admin,
} = require("../middleware/authMiddleware");


router.get("/", protect, admin, getSettings);

router.put("/", protect, admin, updateSettings);

router.put("/password", protect, admin, changePassword);

module.exports = router;
