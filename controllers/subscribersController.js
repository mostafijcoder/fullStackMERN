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
exports.getSubscriptionPage = (req, res) => {
    res.render("contact");
   };
   exports.saveSubscriber = async (req, res) => {
    try {
        const newSubscriber = new Subscriber({
            name: req.body.name,
            email: req.body.email,
            zipCode: req.body.zipCode
        });

        await newSubscriber.save(); // ✅ Use await instead of callback

        console.log("✅ Subscriber saved:", newSubscriber);
        res.redirect("/subscribers"); // Redirect to subscribers list
    } catch (error) {
        console.error("❌ Error saving subscriber:", error);
        res.status(500).send("Error saving subscriber.");
    }
};

