var express = require("express");
var router = express.Router();
var db = require("../models/blog");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/", auth, (req, res) => {
  // console.log(req.user.id);
  db.User.findById(req.user._id)
    .select("-password")
    .then(user => {
      res.json(user);
    });
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    db.User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new db.User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/api/users/login");
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// // Login wITH PassPort js
// router.post("/login", (req, res, next) => {
//   passport.authenticate("local", {
//     successRedirect: "/users/dashboard",
//     failureRedirect: "/api/users/login",
//     failureFlash: true
//   })(req, res, next);
// });
//Login WIth JWT Token
router.post("/login", async (req, res) => {
  const user = await db.User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email does't exist");
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Password Does not match");
  //Create And Assign Token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.send({ loggedIn: true, token: token, user: user });
  // res.redirect("/users/dashboard");
});

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/api/users/login");
});
module.exports = router;
