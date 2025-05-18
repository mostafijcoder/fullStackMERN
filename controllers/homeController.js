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
    let user = null;

    // 1. Try session-based auth
    if (req.isAuthenticated && req.isAuthenticated()) {
      user = await User.findById(req.user._id);
    }

    // 2. If not logged in, try token-based auth
    if (!user && req.query.apiToken) {
      user = await User.findOne({ apiToken: req.query.apiToken });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: "User not logged in or token invalid." });
    }

    const courseId = req.params.id;

    if (!user.courses.includes(courseId)) {
      user.courses.push(courseId);
      await user.save();
    }

    const subscriber = await Subscriber.findById(user.subscribedAccount);
    if (subscriber && !subscriber.courses.includes(courseId)) {
      subscriber.courses.push(courseId);
      await subscriber.save();
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("❌ Error in joinCourse:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};




exports.errorJSON = (error, req, res, next) => {
  const errorObject = {
    status: 500,
    message: error.message || "Unknown Error"
  };
  res.status(500).json(errorObject);
};
