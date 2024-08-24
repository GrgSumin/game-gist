const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 4001;

const app = express();


// app.get('/league', (req, res) => {
//   return res.json({'data':'ok'})
// })

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173", // Frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply CORS middleware with options
app.use(cors(corsOptions));
app.use(express.json());

// Route handlers
const accRoutes = require("./routes/Users");
const newsRoutes = require("./routes/News");
const groupRoutes = require("./routes/Group");
const footballPlayerRoutes = require("./routes/footballplayer");

app.use("/api/users", accRoutes);
app.use("/api/news", newsRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/groups", groupRoutes);
app.use("/api/footballplayers", footballPlayerRoutes);

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
