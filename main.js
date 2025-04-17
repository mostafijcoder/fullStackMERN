const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const layouts = require("express-ejs-layouts");

const userController = require("./controllers/userController");
const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const subscribersController = require("./controllers/subscribersController");
const contactController = require("./controllers/contactController");
const usersController = require("./controllers/userController");

const seedCourses = require("./seedCourses");
const Course = require("./models/course");
require("dotenv").config();
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const bcrypt = require("bcryptjs");

// ✅ Multer setup for profile picture upload
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

const app = express();

// Cookie and session config
app.use(cookieParser("secret_passcode"));
app.use(session({
  secret: process.env.SECRET,   // Securely loaded from .env
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60000, // 1 minute (change as needed)
    httpOnly: true,
    secure: false // use true in production with HTTPS
  }
}));

// Flash messages
app.use(flash());

// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});

// main.js (or app.js, wherever Express is configured)

// Must be added AFTER `express-session` and `connect-flash()` middleware
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  res.locals.showNotification = true; // optionally control when to show
  next();
});


// ✅ Middleware
app.use(methodOverride("_method"));
app.use(layouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use('/uploads', express.static('uploads'));


// ✅ Template setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layout");

// ✅ Log all requests
app.use((req, res, next) => {
  console.log(`Request made to: ${req.url}`);
  next();
});

// ✅ MongoDB Connection
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/receipe_mongodb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log("✅ Successfully connected to MongoDB!");
    await seedCourses();

    const port = process.env.PORT || 3011;
    app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ✅ Home Routes
app.get("/", homeController.homePage);
app.get("/courses", homeController.showCourses);
app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact Us", showNotification: true });
});
app.post("/contact", homeController.postedSignUpForm);

// ✅ User Routes (with profile picture upload)
app.get("/users/login", usersController.login);
app.post("/users/login", usersController.authenticate, usersController.redirectView);
app.get("/users", userController.index);
app.get("/users/new", userController.new);
app.post("/users/create", userController.upload, userController.create);
app.put("/users/:id", userController.upload, userController.update);
app.get("/users/:id", userController.show);
app.get("/users/:id/edit", userController.edit);
app.put("/users/:id", userController.update);
app.delete("/users/:id", userController.delete);

// ✅ Enrollment Routes
app.get("/enroll", subscribersController.getEnrollmentPage);
app.post("/enroll", subscribersController.saveSubscriberAndEnrollCourse);

// ✅ Subscriber Routes
app.get("/subscribers", subscribersController.getAllSubscribers);
app.get("/subscribers/searchByEmail", subscribersController.searchByEmail);
app.get("/subscribers/searchByZip", subscribersController.searchByZip);
app.get("/contact", subscribersController.getSubscriptionPage); // For form view
// ✅ Subscriber CRUD Routes
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
  res.status(404).render("404", { title: "Page Not Found", showNotification: true });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("500", { title: "Server Error", showNotification: true });
});

