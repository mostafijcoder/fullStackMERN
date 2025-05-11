const mongoose = require("mongoose");
const Subscriber = require("../models/subscriber");
const Course = require("../models/course"); // ✅ Import the Course model
const User = require("../models/user");



exports.getSubscriptionPage = (req, res) => {
    res.render("contact");
};

exports.getEnrollmentPage = async (req, res) => {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      req.flash("error", "Please log in to enroll in a course.");
      return res.redirect("/users/login");
    }

    const { courseId } = req.query;
    const user = req.user;

    const courses = await Course.find();

    // Safely format full name if name is an object
    const prefilledName = typeof user.name === "object"
      ? `${user.name.first || ""} ${user.name.last || ""}`.trim()
      : user.name || "";

    const prefilledEmail = user.email || "";

    res.render("enroll", {
      title: "Enroll in a Course",
      subscribers: [], // You can remove if unused in enroll.ejs
      courses,
      showNotification: false,
      prefilledName,
      prefilledEmail,
      preselectedCourseId: courseId || ""
    });
  } catch (error) {
    console.error("❌ Error loading enrollment page:", error);
    res.status(500).send("Error loading enrollment page.");
  }
};




// ✅ Handle Enrollment Form Submission
exports.saveSubscriberAndEnrollCourse = async (req, res) => {
  try {
    const { name, email, zipCode, courseId, multiple } = req.body; // Get data from the form

    if (!name || !email || !zipCode || !courseId) {
      return res.status(400).send("All fields are required.");
    }

    let subscriber = await Subscriber.findOne({ email }); // Find subscriber by email

    if (!subscriber) { // If not found, create a new subscriber
      subscriber = await Subscriber.create({
        name,
        email,
        zipCode,
        courses: [],
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).send("Course not found.");
    }

    if (multiple === "true") {
      // allow multiple course enrollments
      if (!subscriber.courses.includes(course._id)) {
        subscriber.courses.push(course._id);
        course.subscribers.push(subscriber._id);
      }
    } else {
      // enforce single enrollment
      subscriber.courses = [course._id];
      if (!course.subscribers.includes(subscriber._id)) {
        course.subscribers.push(subscriber._id);
      }
    }

    await subscriber.save();
    // ✅ Check if there's an associated User
    
let user;
if (subscriber.subscribedAccount) {
  user = await User.findById(subscriber.subscribedAccount);
} else {
  user = await User.findOne({ email: subscriber.email });
}

if (user) {
  // Set reverse link if not already
  if (!user.subscribedAccount) {
    user.set("subscribedAccount", subscriber._id);
  }


     // Sync courses (force update)
    user.set("courses", subscriber.courses);
    await user.save();
    console.log("✅ Synced user with subscriber courses:", user.email, user.courses);

  
  // ✅ Also set reverse on Subscriber if missing
  if (!subscriber.subscribedAccount) {
    subscriber.subscribedAccount = user._id;
    await subscriber.save();
  }
}

    await course.save();

    console.log("✅ Enrollment saved:", { name, email, zipCode, multiple });
    // a success message wiil be prompted to the user
    //res.json({ message: "Successfully enrolled!" });
    res.redirect("/subscribers"); // Or a custom thanks page
  } catch (error) {
    console.error("❌ Enrollment error:", error);
    res.status(500).send("Internal Server Error");
  }
};

// ✅ Fetch All Subscribers

exports.getAllSubscribers = async (req, res) => {
  const subscribers = await Subscriber.find().populate("courses");
  res.render("subscribers", { subscribers });
};

exports.searchByEmail = async (req, res) => {
  const email = req.query.email;
  const subscribers = await Subscriber.find({
    email: { $regex: new RegExp(email, "i") }
  }).populate("courses");

  res.render("subscribers", { subscribers });
};

exports.searchByZip = async (req, res) => {
  const zipCode = req.query.zipCode;
  const subscribers = await Subscriber.find({ zipCode }).populate("courses");

  res.render("subscribers", { subscribers });
};

// Show individual subscriber
exports.show = async (req, res) => {
  const { id } = req.params;
  const subscriber = await Subscriber.findById(id).populate("courses");
  if (!subscriber) return res.status(404).send("Subscriber not found");
  res.render("subscribers/show", { subscriber });
};

// Render edit form
exports.edit = async (req, res) => {
  const { id } = req.params;
  const subscriber = await Subscriber.findById(id);
  const courses = await Course.find();
  if (!subscriber) return res.status(404).send("Subscriber not found");
  res.render("subscribers/edit", { subscriber, courses });
};

// Update subscriber
exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, email, zipCode, courseIds } = req.body;
  const subscriber = await Subscriber.findByIdAndUpdate(id, {
    name,
    email,
    zipCode,
    courses: courseIds
  }, { new: true });
  res.redirect("/subscribers");
};

// Delete subscriber
exports.delete = async (req, res) => {
  await Subscriber.findByIdAndDelete(req.params.id);
  res.redirect("/subscribers");
};
