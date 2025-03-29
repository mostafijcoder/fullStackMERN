const Subscriber = require("../models/subscriber");

exports.getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find({});
    res.render("subscribers", { 
      title: "Subscribers List", 
      showNotification: false,  // ✅ Add this to prevent the error
      subscribers 
    }); 
  } catch (error) {
    console.error("❌ Error retrieving subscribers:", error);
    res.status(500).send("Error retrieving subscribers.");
  }
};
