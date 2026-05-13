const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  getUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");

router.post("/", registerUser);

router.post("/login", loginUser);

router.get("/profile", protect, getUserProfile);

router.get("/", protect, admin, getUsers);

router.put("/:id/role", protect, admin, updateUserRole);

router.delete("/:id", protect, admin, deleteUser);

module.exports = router;