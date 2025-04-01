const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema({
 title: {
 type: String,
 required: true,
 unique: true
 },
 description: {
 type: String,
 required: true
 },
 subscribers: [{type: mongoose.Schema.Types.ObjectId, ref: "Subscriber"}],
 items: [],
 zipCode: {
 type: Number,
 min: [10000, "Zip code too short"],
 max: 99999
 }
});
module.exports = mongoose.model("Course", courseSchema);