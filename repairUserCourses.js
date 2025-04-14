const mongoose = require("mongoose");
const User = require("./models/user");
const Subscriber = require("./models/subscriber");

mongoose.connect("mongodb://localhost:27017/receipe_mongodb").then(async () => {
  console.log("🔌 Connected to DB");

  const users = await User.find({}).populate("subscribedAccount");

  for (let user of users) {
    const subscriber = await Subscriber.findOne({ email: user.email.toLowerCase() });

    if (subscriber && subscriber.courses.length > 0) {
      user.courses = subscriber.courses;
      user.subscribedAccount = subscriber._id;
      await user.save();
      console.log(`✅ Fixed user: ${user.email}`);
    }
  }

  mongoose.disconnect();
});
