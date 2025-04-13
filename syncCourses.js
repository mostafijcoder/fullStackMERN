const mongoose = require("mongoose");
const User = require("./models/user");
const Subscriber = require("./models/subscriber");

mongoose.connect("mongodb://localhost:27017/receipe_mongodb");

async function syncCourses() {
  const users = await User.find();

  for (let user of users) {
    if (!user.courses || user.courses.length === 0) {
      const subscriber = await Subscriber.findOne({ email: user.email });
      if (subscriber && subscriber.courses.length > 0) {
        user.courses = subscriber.courses;
        await user.save();
        console.log(`Synced courses for ${user.email}`);
      }
    }
  }

  mongoose.disconnect();
}

syncCourses();
