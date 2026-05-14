const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");

const projectRoutes = require("./routes/projectRoutes");

const dashboardRoutes = require("./routes/dashboardRoutes");

const reportRoutes = require("./routes/reportRoutes");

const settingsRoutes = require("./routes/settingsRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());



app.get("/", (req, res) => {
  res.send("API running...");
});

app.use("/api/users", userRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/reports", reportRoutes);

app.use("/api/settings", settingsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
