const express = require("express");
const userController = require("./controllers/userController"); // Import userController

 // support PUT and DELETE in forms
const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const Subscriber = require("./models/subscriber");
const subscribersController = require("./controllers/subscribersController");
const seedCourses = require("./seedCourses");
const contactController = require("./controllers/contactController");
const path = require("path");
const Course = require("./models/course");


const app = express();
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
mongoose.Promise= global.Promise;
app.use(layouts);

// ✅ Connect to MongoDB first
mongoose
  .connect("mongodb://localhost:27017/receipe_mongodb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ Successfully connected to MongoDB!");

    // ✅ Seed the database only once
    await seedCourses();

    // ✅ Start the server after DB is ready
    const port = process.env.PORT || 3011;
    app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit process if DB fails to connect
  });

// ✅ Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layout");

// ✅ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// ✅ Log Requests
app.use((req, res, next) => {
  console.log(`Request made to: ${req.url}`);
  next();
});
// USER ROUTES
app.get("/users", userController.index);
app.get("/users/new", userController.new);
app.post("/users/create", userController.create,userController.index);
app.get("/users/:id", userController.show);
app.get("/users/:id/edit", userController.edit);
app.put("/users/:id", userController.update);
app.delete("/users/:id", userController.delete);
// Route to show the enrollment form
app.get("/enroll", async (req, res) => {
  const courses = await Course.find();
  res.render("enroll", { courses, title: "Enroll in a Course", showNotification: false });
});

// POST form handler
app.post("/enroll", subscribersController.saveSubscriberAndEnrollCourse);
app.get("/subscribers", subscribersController.getAllSubscribers);
app.get("/subscribers/searchByEmail", subscribersController.searchByEmail);
app.get("/subscribers/searchByZip", subscribersController.searchByZip);

//contact route
app.post("/contact", contactController.saveContact);
app.get("/contacts", contactController.getAllContacts); // All contacts list
app.get("/contacts/search", contactController.searchByEmail); // Search contacts by email


// ✅ Route Definitions
app.get("/", homeController.homePage);
app.get("/courses", homeController.showCourses);
app.post("/contact", homeController.postedSignUpForm);
app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact Us", showNotification: true });
});

app.get("/name/:myName", homeController.respondWithName);

// ✅ Fix Subscriber Route
app.get("/subscribers", subscribersController.getAllSubscribers);
app.get("/contact", subscribersController.getSubscriptionPage);
app.get("/enroll", subscribersController.getEnrollmentPage);
app.get("/enroll", (req, res) => {
    res.render("enroll", { showNotification: false }); // Ensuring showNotification is always available
});
// ✅ Handle 404 Errors
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found", showNotification: true });
});

// ✅ Handle 500 Errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("500", { title: "Server Error", showNotification: true });
});

