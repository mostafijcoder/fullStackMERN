const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const layouts = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const passport = require("passport");
const User = require("./models/user");
const seedCourses = require("./seedCourses");
require("dotenv").config();

const app = express();

// ✅ MongoDB Connection
mongoose.connect("mongodb://localhost:27017/receipe_mongodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", async () => {
  console.log("✅ Connected to MongoDB");
  await seedCourses();
  const port = process.env.PORT || 3011;
  app.listen(port, () => console.log(`🚀 Server is running at http://localhost:${port}`));
});

// ✅ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(layouts);
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// ✅ EJS Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layout");

// ✅ Request Logging
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

// ✅ Session & Flash
app.use(cookieParser("secret_passcode"));
app.use(
  session({
    secret: process.env.SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true },
  })
);
app.use(flash());

// ✅ Passport Config
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ✅ Set local variables for views
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash(); // all flash messages
  res.locals.messages = {
    success: req.flash("success"),
    error: req.flash("error")
  };
  next();
});

app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated ? req.isAuthenticated() : false;
  res.locals.currentUser = req.user || null;
  next();
});



// ✅ Use Modular Routes
const routes = require("./routes");
app.use("/", routes);
