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

// ✅ Controllers
const userController = require("./controllers/userController");
const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const subscribersController = require("./controllers/subscribersController");
const contactController = require("./controllers/contactController");

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

// ✅ Logging
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

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  res.locals.currentUser = req.user;
  next();
});

// Make currentUser and login status available in all EJS views
app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;
  res.locals.loggedIn = req.isAuthenticated ? req.isAuthenticated() : false;
  res.locals.flashMessages = req.flash();
  res.locals.showNotification = true;

  next();
});


// ✅ Home Routes
app.get("/", homeController.homePage);
app.get("/courses", homeController.showCourses);
app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact Us", showNotification: true });
});

app.post("/contact", contactController.saveContact);


// ✅ Auth Routes
app.get("/users/login", userController.login);
app.post("/users/login", passport.authenticate("local", {
  successRedirect: "/users/profile",
  failureRedirect: "/users/login",
  failureFlash: true
}));
app.get("/users/logout", userController.logout);

// ✅ User Routes
app.get("/users", userController.index);
app.get("/users/new", userController.new);
app.post("/users", userController.upload, userController.create);
app.get("/users/profile", userController.profile); // current user profile
app.get("/users/:id", userController.show);
app.get("/users/:id/edit", userController.edit);
app.put("/users/:id", userController.upload, userController.update);
app.delete("/users/:id", userController.delete);

// ✅ Enrollment Routes
app.get("/enroll", subscribersController.getEnrollmentPage);
app.post("/enroll", subscribersController.saveSubscriberAndEnrollCourse);

// ✅ Subscriber Routes
app.get("/subscribers", subscribersController.getAllSubscribers);
app.get("/subscribers/searchByEmail", subscribersController.searchByEmail);
app.get("/subscribers/searchByZip", subscribersController.searchByZip);
app.get("/subscribers/:id", subscribersController.show);
app.get("/subscribers/:id/edit", subscribersController.edit);
app.put("/subscribers/:id", subscribersController.update);
app.delete("/subscribers/:id", subscribersController.delete);

// ✅ Contact Routes
app.post("/contact", contactController.saveContact);
app.get("/contacts", contactController.getAllContacts);
app.get("/contacts/search", contactController.searchByEmail);

// ✅ Error Handling
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("500", { title: "Server Error" });
});
