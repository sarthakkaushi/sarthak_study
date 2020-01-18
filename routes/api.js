var express = require("express");
var router = express.Router();
var db = require("../models/blog");
var slugify = require("slugify");
const verify = require("../config/verifyToken");

/* GET home page. */
router.get("/all/post", function(req, res, next) {
  db.Blog.find({}).then(r => {
    res.send(r);
  });
});

router.post("/post", verify, async (req, res) => {
  const id = req.user._id;
  const name = await db.User.findById(id).then(r => {
    return r.name;
  });
  //   var author = {
  //     id: req.user._id,
  //     username: req.user.username
  // }
  let sendData = {
    title: req.body.title,
    text: req.body.content,
    slug: slugify(req.body.title, {
      replacement: "-", // replace spaces with replacement
      remove: null, // regex to remove characters
      lower: true // result in lower case
    }),
    author: {
      id,
      name
    }
  };

  db.Blog.create(sendData).then(r => {
    res.send({
      result: true,
      url: `${r.slug}`,
      _id: r._id,
      mainData: r
    });
  });
});

router.get("/post/:slug", (req, res) => {
  const slug = req.params.slug;
  db.Blog.find({ slug: slug }).then(r => {
    //res.send(r)
    res.send({ data: r[0] });
  });
});

router.put("/post/update/:id", verify, (req, res) => {
  const newData = {
    title: req.body.title,
    text: req.body.content
  };

  db.Blog.findByIdAndUpdate(req.params.id, { $set: newData }).then(r => {
    db.Blog.findById(req.params.id).then(r => {
      let send = r;
      send.saved = true;
      console.log(send);
      res.send({ ...r, saved: true });
    });
  });
});
router.get("/post/delete/:id", verify, (req, res) => {
  const id = req.params.id;
  db.Blog.findByIdAndDelete(id).then(r => {
    res.send({
      deleted: true
    });
  });
});
/*
db.Blog.find({}).then(r => {
  r.forEach(d => {
    db.Blog.findByIdAndDelete(d._id).then(r => {
      console.log(`Deleted`);
    });
  });
  db.Notepad.findByIdAndDelete();
});
*/
module.exports = router;
