const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const {
  registerUser,
  loginUser,
    getUserProfile,
} = require("../controllers/userController");

router.post("/", registerUser);

router.post("/login", loginUser);

router.get("/profile", protect, getUserProfile);

module.exports = router;