const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4001;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",")
      : ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const userRoutes = require("./routes/Users");
const newsRoutes = require("./routes/News");
const groupRoutes = require("./routes/Group");
const footballDataRoutes = require("./routes/footballData");
const fantasyRoutes = require("./routes/fantasy");

app.use("/api/users", userRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/football", footballDataRoutes);
app.use("/api/fantasy", fantasyRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.name === "MulterError") {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: "Internal server error" });
});

// Database connection
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/game-gist";
mongoose
  .connect(mongoUri)
  .then(async () => {
    console.log("Connected to MongoDB");
    // Detect active season before starting anything else
    const { detectSeason } = require("./services/apiFootball");
    await detectSeason();
    // Start cron jobs after DB is connected and season is resolved
    const { startCronJobs } = require("./services/cron");
    startCronJobs();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Ensure uploads directory exists
const fs = require("fs");
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
