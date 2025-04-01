const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    zipCode: { type: Number, required: true },
    courses : [{type: mongoose.Schema.Types.ObjectId, ref: "Course"}]
});

subscriberSchema.methods.getInfo = function() {
    return `Name: ${this.name} Email: ${this.email} Zip Code: ${this.zipCode}`;
   };
   subscriberSchema.statics.findLocalSubscribers = function(zipCode) {
    return this.find({ zipCode: zipCode }).exec();
    }



const Subscriber = mongoose.model("Subscriber", subscriberSchema);
module.exports = Subscriber;
