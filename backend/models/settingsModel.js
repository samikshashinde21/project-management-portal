const mongoose = require("mongoose");

const settingsSchema = mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "system",
    },

    systemName: {
      type: String,
      required: true,
      default: "Project Management Website",
    },

    allowRegistration: {
      type: Boolean,
      default: true,
    },

    defaultProjectStatus: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model("Settings", settingsSchema);

module.exports = Settings;
