const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  createUserByAdmin,
  updateUserByAdmin,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");

router.post("/", registerUser);

router.post("/login", loginUser);

router.get("/profile", protect, getUserProfile);

router.put("/profile", protect, updateUserProfile);

router.get("/", protect, admin, getUsers);

router.post("/admin", protect, admin, createUserByAdmin);

router.put("/:id", protect, admin, updateUserByAdmin);

router.put("/:id/role", protect, admin, updateUserRole);

router.delete("/:id", protect, admin, deleteUser);

module.exports = router;
