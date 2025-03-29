const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    zipCode: { type: Number, required: false } // ✅ Made optional
});

module.exports = mongoose.model("Subscriber", subscriberSchema); // Export the model
