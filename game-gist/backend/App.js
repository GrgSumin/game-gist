const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 4001;

const app = express();

app.use(cors());
app.use(express.json());

const accRoutes = require("./routes/Users");
const newsRoutes = require("./routes/News");
app.use("/api/users", accRoutes);
app.use("/api/news", newsRoutes);

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
