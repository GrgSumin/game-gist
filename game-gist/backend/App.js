const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 4001;

const app = express();

// CORS configuration

// Apply CORS middleware with options
app.use(cors());
app.use(express.json());

// Route handlers
const accRoutes = require("./routes/Users");
const newsRoutes = require("./routes/News");
const groupRoutes = require("./routes/Group");
const teamRoutes = require("./routes/teamRoutes");
const footballPlayerRoutes = require("./routes/footballPlayer");
const { default: axios } = require("axios");
const playerRoutes = require("./routes/player");

app.get("/league", async (req, res) => {
  const { data } = await axios.get(
    "https://api.sportmonks.com/v3/football/leagues?api_token=qPuTNcOVABfqx6OHJ5VhSRljDfFan4U4Jh4QDXnVWi5WBgdiBEqFskqw9Afb"
  );
  return res.json({
    data,
  });
});
app.get("/fantasynews", async (req, res) => {
  try {
    const response = await axios.get(
      "https://footballnewsapi.netlify.app/.netlify/functions/api/news/onefootball"
    );
    const data = response.data;
    res.json(data);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ message: "Failed to fetch news" });
  }
});

app.use("/api/users", accRoutes);
app.use("/api/news", newsRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/groups", groupRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/footballplayers", footballPlayerRoutes);
app.use("/api/players", playerRoutes);

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/game-gist", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
