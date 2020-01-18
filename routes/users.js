var express = require("express");
var router = express.Router();
const verify = require("../config/verifyToken");
var db = require("../models/blog");

/* GET users listing. */
router.get("/dashboard", verify, async (req, res, next) => {
  const id = req.user._id;
  const name = await db.User.findById(id).then(r => {
    return r.name;
  });
  db.Blog.find({})
    .where("author.name")
    .equals(name)
    .then(r => res.send(r));
});

// router.get("/dashboard/", verify, async (req, res, next) => {
//   const id = req.user._id;
//   const name = await db.User.findById(id).then(r => {
//     return r.name;
//   });
//   db.Blog.find({})
//     .where("author.name")
//     .equals(name)
//     .then(r => res.send(r));
// });
module.exports = router;
