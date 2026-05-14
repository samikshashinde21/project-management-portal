const mongoose = require("mongoose");

const settingsSchema = mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "system",
    },

    maintenanceMode: {
      type: Boolean,
      default: false,
    },

  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model("Settings", settingsSchema);

module.exports = Settings;
