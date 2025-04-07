// Import the courses data from mongoDB courses collection and export it
const Course = require("../models/course");

 // Fetch all courses from the database


exports.showCourses =async (req, res) => {
    let courses = await Course.find({});
    res.render("courses", { title: "Courses Available", courses: courses, showNotification: true, offeredCourses: courses
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

