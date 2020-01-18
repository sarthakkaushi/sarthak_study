var express = require("express");
var router = express.Router();
var db = require("../models/blog");

/* GET home page. */

router.get("/", function(req, res, next) {
  res.render("welcome", { title: "Express" });
});

module.exports = router;
