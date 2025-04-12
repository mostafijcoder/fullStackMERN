const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true, // Ensures course titles are unique
  },

  description: {
    type: String, // Short description of the course
    required: true
  },
  items: [String], // Array of items/ingredients included in the course
  cost: {
    type: Number,
    required: true,
    min: [0, "Cost cannot be negative"], // Ensures cost is not negative
  },
  zipCodes: [{ type: Number, min: [10000, "Zip code too short"], max: 99999 }], // Array of ZIP codes where the course is available
  subscribers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Subscriber", // References the Subscriber model
    }
  ]

},
{
// Add a timestamps property to record createdAt and updatedAt dates.
  timestamps: true
});

module.exports = mongoose.model("Course", courseSchema);
