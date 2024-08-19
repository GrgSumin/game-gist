const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  isHeadline: {
    type: Boolean,
    required: false,
    default: false,
  },
  short_desc: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  url: {
    type: String,
  },
  video: {
    type: String,
  },
});

let collectionname = "news";
module.exports = mongoose.model(collectionname, NewsSchema);
