const express = require("express");
const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const Subscriber = require("./models/subscriber");
const subscribersController = require("./controllers/subscribersController");
const seedCourses = require("./seedCourses");


const app = express();
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
app.set("layout", "layout");

// ✅ Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// ✅ Log Requests
app.use((req, res, next) => {
  console.log(`Request made to: ${req.url}`);
  next();
});

// ✅ Route Definitions
app.get("/", homeController.homePage);
app.get("/courses", homeController.showCourses);
app.post("/contact", homeController.postedSignUpForm);
app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact Us", showNotification: true });
});
app.get("/items/:vegetable", homeController.sendReqParam);
app.get("/name/:myName", homeController.respondWithName);

// ✅ Fix Subscriber Route
app.get("/subscribers", subscribersController.getAllSubscribers);
app.get("/contact", subscribersController.getSubscriptionPage);
app.post("/subscribe", subscribersController.saveSubscriber);
app.get("/subscribers/zip/:zipCode", subscribersController.getLocalSubscribers);
app.get("/subscribers/local", subscribersController.getLocalSubscribers);

// Course Enrollment Routes
app.post("/enroll", subscribersController.enrollSubscriberToCourse);
app.get("/subscribers/:id/courses", subscribersController.getSubscriberWithCourses);
app.get("/enroll", subscribersController.getEnrollmentPage);
app.get("/enroll", (req, res) => {
    res.render("enroll", { showNotification: false }); // Ensuring showNotification is always available
});
app.get("/enroll", subscribersController.showEnrollPage);




// ✅ Handle 404 Errors
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found", showNotification: true });
});

// ✅ Handle 500 Errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("500", { title: "Server Error", showNotification: true });
});

