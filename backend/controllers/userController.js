const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");


// @desc Register user
// @route POST /api/users
// @access Public

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({
        message: "Invalid user data",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// @desc Login user
// @route POST /api/users/login
// @access Public

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (
      user &&
      (await bcrypt.compare(password, user.password))
    ) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getUserProfile = async (req, res) => {
  res.json(req.user);
};

const updateUserProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (user) {

      user.name = req.body.name || user.name;

      user.email = req.body.email || user.email;

      if (req.body.password) {

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(
          req.body.password,
          salt
        );
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateToken(updatedUser._id),
      });

    } else {
      res.status(404).json({
        message: "User not found",
      });
    }

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  const users = await User.find({});

  res.json(users);
};

const updateUserRole = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.role = req.body.role || user.role;

    const updatedUser = await user.save();

    res.json(updatedUser);
  } else {
    res.status(404).json({
      message: "User not found",
    });
  }
};

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();

    res.json({
      message: "User removed",
    });
  } else {
    res.status(404).json({
      message: "User not found",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  updateUserRole,
  deleteUser,

};