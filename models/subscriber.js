const mongoose = require("mongoose");
const User = require("./user");

const subscriberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique:true, required: true },
    zipCode: { type: Number, required: false },
    courses : [{type: mongoose.Schema.Types.ObjectId, ref: "Course"}],
    subscribedAccount: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
},
{
    timestamps: true
});

subscriberSchema.methods.getInfo = function() {
    return `Name: ${this.name} Email: ${this.email} Zip Code: ${this.zipCode}`;
   };
subscriberSchema.statics.findLocalSubscribers = function(zipCode) {
    return this.find({ zipCode: zipCode }).exec();
    }
    

const Subscriber = mongoose.model("Subscriber", subscriberSchema);
module.exports = Subscriber;
