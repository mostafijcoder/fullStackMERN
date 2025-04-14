// repairSubscriberUsers.js
const mongoose = require("mongoose");
const Subscriber = require("./models/subscriber");
const User = require("./models/user");

mongoose.connect("mongodb://localhost:27017/receipe_mongodb");

async function syncSubscribers() {
  const users = await User.find({});

  for (const user of users) {
    const subscriber = await Subscriber.findOne({ email: user.email });
    if (subscriber && !subscriber.subscribedAccount) {
      subscriber.subscribedAccount = user._id;
      await subscriber.save(); // will trigger the post save
      console.log(`Linked Subscriber: ${subscriber.email}`);
    }
  }

  mongoose.disconnect();
}

syncSubscribers();
