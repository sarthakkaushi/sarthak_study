const mongoose = require("mongoose");

var blogSchema = new mongoose.Schema({
  text: {
    type: String
  },
  slug: {
    type: String
  },
  title: {
    type: String
  },
  date: {
    type: Date,
    // `Date.now()` returns the current unix timestamp as a number
    default: Date.now
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    name: String
  }
});

module.exports = mongoose.model("Blog", blogSchema);
