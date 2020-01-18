const mongoose = require("mongoose");
// mongoose.set("debug", true);

mongoose.connect(
  "mongodb://sarthak:sarthak12@ds249017.mlab.com:49017/notepad",
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Connected To Database`);
    }
  }
);

mongoose.Promise = Promise;

module.exports.Blog = require("./blog");
module.exports.Todo = require("../todo/todo");
module.exports.User = require("../user/User");
