const express = require("express");
const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const Subscriber = require("./models/subscriber");
const subscribersController = require("./controllers/subscribersController");

const app = express();
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");

app.use(layouts);

// ✅ MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/receipe_mongodb", {
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Successfully connected to MongoDB!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

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

// ✅ Handle 404 Errors
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found", showNotification: true });
});

// ✅ Handle 500 Errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("500", { title: "Server Error", showNotification: true });
});

// ✅ Start the Server
const port = process.env.PORT || 3011;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
