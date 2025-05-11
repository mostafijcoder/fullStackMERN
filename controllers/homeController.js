const Subscriber = require("../models/subscriber");
const User = require("../models/user");




// Import the courses data from mongoDB courses collection and export it
const Course = require("../models/course");

 // Fetch all courses from the database


 exports.showCourses = async (req, res) => {
  try {
    const courses = await Course.find();

    if (req.query.format === "json") {
      res.set("Cache-Control", "no-store, private, max-age=0");

      let userCourses = [];

      if (req.isAuthenticated && req.isAuthenticated()) {
        const user = await User.findById(req.user._id);
        if (user) {
          userCourses = user.courses.map(course => course.toString());
        }
      }

      const response = courses.map(course => ({
        _id: course._id,
        title: course.title,
        description: course.description,
        joined: userCourses.includes(course._id.toString())
      }));

      return res.json(response);
    }

    // Render normal view
    res.render("courses", {
      title: "Courses Available",
      courses,
      showNotification: true,
      offeredCourses: courses,
    });
  } catch (error) {
    console.error("❌ Error fetching courses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
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

// controllers/homeController.js

exports.index = async (req, res, next) => {
  try {
    const courses = await Course.find();
    req.data = courses; // attach data to request
    next(); // pass to respondJSON
  } catch (error) {
    next(error);
  }
};

exports.respondJSON = (req, res) => {
  res.json({
    status: 200,
    data: req.data || []
  });
};


exports.joinCourse = async (req, res) => {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json({ success: false, message: "User not logged in." });
    }

    const user = await User.findById(req.user._id);
    const courseId = req.params.id;

    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    // Update user's course list
    if (!user.courses.includes(courseId)) {
      user.courses.push(courseId);
      await user.save();
    }

    // Fetch linked subscriber
    let subscriber = await Subscriber.findOne({ _id: user.subscribedAccount });

    // If subscriber exists and doesn't have this course, update it
    if (subscriber && !subscriber.courses.includes(courseId)) {
      subscriber.courses.push(courseId);
      await subscriber.save();
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("❌ Error joining course:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

exports.errorJSON = (error, req, res, next) => {
  const errorObject = {
    status: 500,
    message: error.message || "Unknown Error"
  };
  res.status(500).json(errorObject);
};
