var mongoose = require("mongoose");

var todoSchema = mongoose.Schema({
  text: String,
  createdAt: { type: Date, default: Date.now },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    name: String
  },
  completed: { type: Boolean, default: false }
});

module.exports = mongoose.model("Todo", todoSchema);
