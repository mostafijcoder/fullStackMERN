const mongoose = require("mongoose");
const Subscriber = require("../models/subscriber");
const Course = require("../models/course"); // ✅ Import the Course model


exports.getSubscriptionPage = (req, res) => {
    res.render("contact");
};

// ✅ Render Enrollment Page
exports.getEnrollmentPage = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            throw new Error("MongoDB is not connected yet.");
          }
        const subscribers = await Subscriber.find({});
        const courses = await Course.find({});
        res.render("enroll", { title: "Enroll in a Course", subscribers, courses, showNotification: false });
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
