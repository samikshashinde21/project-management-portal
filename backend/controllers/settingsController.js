const bcrypt = require("bcryptjs");

const Settings = require("../models/settingsModel");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");

const passwordRuleMessage =
  "Password must be more than 6 characters and include one uppercase letter and one symbol";

const isValidPassword = (password) =>
  typeof password === "string" &&
  password.length > 6 &&
  /[A-Z]/.test(password) &&
  /[^A-Za-z0-9]/.test(password);


const getSettingsDocument = async () => {
  let settings = await Settings.findOne({
    key: "system",
  });

  if (!settings) {
    settings = await Settings.create({
      key: "system",
    });
  }

  return settings;
};


// @desc Get system settings
// @route GET /api/settings
// @access Admin

const getSettings = async (req, res) => {
  try {
    const settings = await getSettingsDocument();

    res.json(settings);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// @desc Get public maintenance status
// @route GET /api/settings/public
// @access Public

const getPublicSettings = async (req, res) => {
  try {
    const settings = await getSettingsDocument();

    res.json({
      maintenanceMode: settings.maintenanceMode,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// @desc Update system settings
// @route PUT /api/settings
// @access Admin

const updateSettings = async (req, res) => {
  try {
    const settings = await getSettingsDocument();

    if (typeof req.body.maintenanceMode === "boolean") {
      settings.maintenanceMode = req.body.maintenanceMode;
    }

    const updatedSettings = await settings.save();

    res.json(updatedSettings);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// @desc Change admin password
// @route PUT /api/settings/password
// @access Admin

const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({
        message: passwordRuleMessage,
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(
      newPassword,
      salt
    );

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getSettings,
  getPublicSettings,
  updateSettings,
  changePassword,
};
