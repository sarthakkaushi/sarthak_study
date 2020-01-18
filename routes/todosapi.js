const express = require("express"),
  router = express.Router(),
  db = require("../models/blog"),
  auth = require("../middleware/auth");
const verify = require("../config/verifyToken");

router.get("/", (req, res) => {
  db.Todo.find({}).then(r => res.send(r));
});

router.post("/", verify, async (req, res) => {
  const { text } = req.body;
  const id = req.user._id;
  const name = await db.User.findById(id).then(r => {
    return r.name;
  });
  const singleTodo = {
    text: text,
    author: {
      id,
      name
    }
  };
  db.Todo.create(singleTodo)
    .then(r => {
      res.send({ saved: true, data: r });
    })
    .catch(err => res.send({ saved: false }));
});
const update = (id, data) => {
  return new Promise((resolve, rejecet) => {
    const propOwn = Object.getOwnPropertyNames(data);

    resolve(data);
  });
};
router.put("/:id", verify, async (req, res) => {
  const id = req.params.id;
  const data = await update(id, req.body);
  db.Todo.findByIdAndUpdate(req.params.id, data).then(r => {
    res.send({
      saved: true
    });
  });
});
module.exports = router;
