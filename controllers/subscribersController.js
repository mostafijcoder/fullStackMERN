const Subscriber = require("../models/subscriber");

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

exports.getLocalSubscribers = (req, res) => {
    const zipCode = parseInt(req.params.zipCode); // Get ZIP code from request params
    console.log(`🔍 Searching for subscribers in ZIP: ${zipCode}`);

    Subscriber.findLocalSubscribers(zipCode) // ✅ Use static method
        .then((subscribers) => {
            console.log("✅ Subscribers found:", subscribers);
            
                return res.json(subscribers);
    
        })
        .catch((error) => {
            console.error("❌ Error finding subscribers:", error);
            res.status(500).send("Error finding subscribers.");
        });
};
