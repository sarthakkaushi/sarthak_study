var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
var cors = require("cors");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var apiRoutes = require("./routes/api");
var todosRoute = require("./routes/todosapi");
var loginApiROutes = require("./routes/loginapi");
var app = express();
const passport = require("passport");
require("dotenv").config();

require("./config/passport")(passport);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "client")));

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", indexRouter);
app.use("/api/userdata", usersRouter);

app.use("/api", apiRoutes);
app.use("/api/todos", todosRoute);

app.use("/api/users", loginApiROutes);

app.use(express.static("client/build"));

app.get("*", (req, res) => {
  console.log(`Got Request For It`);
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(3003, () => console.log(`Server is Up ANd Runnin on port 3003`));
