const mongoose = require("mongoose");

const ApiCacheSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // TTL: 1 hour auto-delete
  },
});

module.exports = mongoose.model("ApiCache", ApiCacheSchema);
