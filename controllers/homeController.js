// Import the courses data from mongoDB courses collection and export it
const Course = require("../models/course");

 // Fetch all courses from the database


 exports.showCourses = async (req, res) => {
    const courses = await Course.find();
    // if the client asked for JSON, send it
    if (req.query.format === "json") {
      res.set("Cache-Control", "no-store, private, max-age=0");
      return res.json(courses);
    }
    // otherwise render the normal view
    res.render("courses", {
      title: "Courses Available",
      courses,
      showNotification: true,
      offeredCourses: courses,
    });
  };

exports.postedSignUpForm = (req, res) => {
    res.render("thanks", { title: "Thank You", showNotification: true });
   };




exports.respondWithName = (req, res) => {
    let paramsName = req.params.myName;
    res.render("index", { name: paramsName, title: "User Page" }); // Pass title
};

exports.homePage = (req, res) => {
    res.render("index", { title: "Home Page", name: "Guest", showNotification: true });
};

exports.respondWithName = (req, res) => {
    let paramsName = req.params.myName;
    res.render("index", { title: `Hello, ${paramsName}`, name: paramsName, showNotification: true });
};

