const mongoose = require("mongoose");
const Subscriber = require("../models/subscriber");
const Course = require("../models/course"); // ✅ Import the Course model




// Controller function for handling subscriber search
exports.getSubscribers = async (req, res) => {
    try {
        const zipCode = req.query.zipCode;  // Get the ZIP code from the query params
        let subscribers;

        if (zipCode) {
            subscribers = await Subscriber.find({ zipCode: zipCode });  // Filter subscribers by ZIP
        } else {
            subscribers = await Subscriber.find({});  // Get all subscribers if no ZIP code is provided
        }

        res.json(subscribers);  // Send the data as a JSON response
    } catch (error) {
        console.error("❌ Error retrieving subscribers:", error);
        res.status(500).send("Error retrieving subscribers.");
    }
};


exports.getAllSubscribers = async (req, res) => {
    try {
        let query = {}; // Default query to fetch all subscribers

        if (req.query.zipCode) {
            console.log(`🔍 Searching for subscribers in ZIP: ${req.query.zipCode}`);
            query.zipCode = req.query.zipCode; // Match exact zipCode
        }

        const subscribers = await Subscriber.find(query);

        // Define showNotification based on your condition
        let showNotification = false; // Default is false
        if (req.query.zipCode) {
            showNotification = true; // Set it to true if ZIP code search was done
        }

        if (req.headers["x-requested-with"] === "XMLHttpRequest") {
            console.log("✅ Sending JSON Response:", subscribers);
            return res.json(subscribers); // Send JSON response if AJAX request
        }

        res.render("subscribers", { 
            title: "Subscribers List", 
            subscribers,
            showNotification // Pass showNotification to the view
        });

    } catch (error) {
        console.error("❌ Error retrieving subscribers:", error);
        res.status(500).send("Error retrieving subscribers.");
    }
};

exports.getSubscriptionPage = (req, res) => {
    res.render("contact");
};

exports.saveSubscriber = (req, res) => {
    const newSubscriber = new Subscriber({
        name: req.body.name,
        email: req.body.email,
        zipCode: req.body.zipCode
    });

    newSubscriber.save()
        .then((savedSubscriber) => {
            console.log("✅ Subscriber saved:", savedSubscriber.getInfo()); // use the instance method that was created in subscriber.js used to get the one subscriber info.
            res.render("thanks", { 
                title: "Thank You", 
                subscriber: savedSubscriber, 
                showNotification: true 
            });
        })
        .catch((error) => {
            console.error("❌ Error saving subscriber:", error);
            res.status(500).send("Error saving subscriber.");
        });
};



// ✅ Get local subscribers by zip code
exports.getLocalSubscribers = async (req, res) => {
    try {
        const { zipCode } = req.query;  // Get zip code from query parameters
        const subscribers = await Subscriber.findLocalSubscribers(zipCode);

        res.json({
            message: `Subscribers in zip code ${zipCode}`,
            subscribers: subscribers.map(sub => sub.getInfo())
        });
    } catch (error) {
        console.error("❌ Error fetching local subscribers:", error);
        res.status(500).json({ message: "Error fetching local subscribers." });
    }
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


// Enroll a subscriber in a course


exports.enrollSubscriberToCourse = async (req, res) => {
  try {
    console.log("Received request body:", req.body); // Debugging log
    const { name, email, zipCode, courseId, multiple } = req.body;

    // Validate required fields
    if (!name || !email || !zipCode || !courseId) {
      return res.status(400).json({ message: "❌ All fields are required!" });
    }

    console.log("📩 Enrolling subscriber:", { name, email, zipCode, courseId, multiple });

    // Find the subscriber by email
    let subscriber = await Subscriber.findOne({ email });

    if (!subscriber) {
      console.log("❌ Subscriber not found. Creating a new one.");
      subscriber = await Subscriber.create({ name, email, zipCode, courses: [] });
    }

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "❌ Course not found." });
    }

    // Enrollment logic
    if (multiple === "false") {
      // Single Course Enrollment: Prevent multiple enrollments
      if (subscriber.courses.length > 0) {
        return res.status(400).json({ message: "❌ You are already enrolled in a course." });
      }
      subscriber.courses = [courseId]; // Replace existing course
    } else {
      // Multiple Course Enrollment
      if (!subscriber.courses.includes(courseId)) {
        subscriber.courses.push(courseId);
      }
    }

    // Save subscriber with updated courses
    await subscriber.save();

    res.json({ message: `✅ Successfully enrolled in ${course.title}` });
  } catch (error) {
    console.error("❌ Error enrolling subscriber:", error);
    res.status(500).json({ message: "❌ Internal server error." });
  }
};

exports.getSingleCourseEnrollers = async (req, res) => {
    try {
      const subscribers = await Subscriber.find({ courses: { $size: 1 } }).populate("courses");
      res.render("enrolledList", { title: "Single Course Enrollers", subscribers });
    } catch (err) {
      res.status(500).json({ message: "❌ Error fetching enrollers" });
    }
  };
  
  exports.getMultiCourseEnrollers = async (req, res) => {
    try {
      const subscribers = await Subscriber.find({ courses: { $size: { $gt: 1 } } }).populate("courses");
      res.render("enrolledList", { title: "Multi Course Enrollers", subscribers });
    } catch (err) {
      res.status(500).json({ message: "❌ Error fetching enrollers" });
    }
  };
  
  exports.searchSubscriber = async (req, res) => {
    try {
      const { name } = req.query;
      const subscriber = await Subscriber.findOne({ name }).populate("courses");
      if (!subscriber) {
        return res.json({ message: "❌ Subscriber not found." });
      }
      res.json(subscriber);
    } catch (err) {
      res.status(500).json({ message: "❌ Error fetching subscriber" });
    }
  };
  

// Get subscriber with course details
exports.getSubscriberWithCourses = async (req, res) => {
    try {
        const subscriberId = req.params.id; // Get subscriber ID from request

        // Find the subscriber and populate course details
        const subscriber = await Subscriber.findById(subscriberId).populate("courses");

        if (!subscriber) {
            return res.status(404).json({ message: "Subscriber not found." });
        }

        res.json(subscriber);

    } catch (error) {
        console.error("❌ Error fetching subscriber with courses:", error);
        res.status(500).send("Error fetching subscriber.");
    }
};


exports.showEnrollPage = async (req, res) => {
    try {
        const courses = await Course.find(); // Fetch all courses from DB
        res.render("enroll", { courses, showNotification: false });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.render("enroll", { courses: [], showNotification: false, error: "Failed to load courses." });
    }
};



//

exports.enrollSubscriberToCourse = async (req, res) => {
  const { name, email, zipCode, courseId, multiple } = req.body;

  try {
    if (!name || !email || !zipCode || !courseId) {
      return res.status(400).send("All fields are required.");
    }

    let subscriber = await Subscriber.findOne({ email });

    if (!subscriber) {
      subscriber = await Subscriber.create({ name, email, zipCode, courses: [courseId] });
    } else {
      if (multiple === "false" && subscriber.courses.length > 0) {
        return res.status(400).send("Already enrolled in a course.");
      }
      if (!subscriber.courses.includes(courseId)) {
        subscriber.courses.push(courseId);
      }
      await subscriber.save();
    }

    res.redirect("/thanks"); // Redirect to the thank you page
  } catch (err) {
    console.error("Error enrolling subscriber:", err);
    res.status(500).send("Error enrolling in course");
  }
};

exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().populate("courses");
    res.render("subscribers", { subscribers });
  } catch (err) {
    console.error("Error fetching subscribers:", err);
    res.status(500).send("Error loading subscribers");
  }
};


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



exports.enroll = async (req, res) => {
  try {
    const { name, email, zipCode, courseId, multiple } = req.body;

    let subscriber = await Subscriber.findOne({ email });

    if (!subscriber) {
      subscriber = await Subscriber.create({
        name,
        email,
        zipCode,
        courses: [courseId]
      });
    } else {
      const alreadyEnrolled = subscriber.courses.includes(courseId);

      if (multiple === "true" && !alreadyEnrolled) {
        subscriber.courses.push(courseId);
      } else if (multiple === "false") {
        subscriber.courses = [courseId];
      }

      await subscriber.save();
    }

    res.redirect("/subscribers");
  } catch (err) {
    console.error("❌ Enrollment error:", err);
    res.status(500).send("Enrollment failed");
  }
};

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
