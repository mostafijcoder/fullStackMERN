const mongoose = require("mongoose");
const Subscriber = require("./models/subscriber");
const User = require("./models/user");

mongoose.connect("mongodb://localhost:27017/receipe_mongodb");

async function fixSubscribers() {
  const subscribers = await Subscriber.find();

  for (let subscriber of subscribers) {
    // find matching user
    const user = await User.findOne({ email: subscriber.email });

    if (user) {
      subscriber.subscribedAccount = user._id;
      if (subscriber.courses && subscriber.courses.length > 0) {
        user.courses = subscriber.courses;
        await user.save();
      }
      await subscriber.save();
      console.log(`Updated subscriber ${subscriber.email}`);
    }
  }

  mongoose.disconnect();
}

fixSubscribers();
