const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Subscriber = require("./subscriber");

const UserSchema = new Schema({
  name: {
    first: {
      type: String,
      trim: true,
      required: true
    },
    last: {
      type: String,
      trim: true,
      required: true
    }
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  zipCode: {
    type: Number,
    min: [10000, "Zip code too short"],
    max: 99999
  },
  password: {
    type: String,
    required: true
  },
  courses: [{
    type: Schema.Types.ObjectId,
    ref: "Course"
  }],
  subscribedAccount: {
    type: Schema.Types.ObjectId,
    ref: "Subscriber"
  }
}, {
  timestamps: true
});

// ✅ Virtual Attribute: fullName
UserSchema.virtual("fullName").get(function () {
  return `${this.name.first} ${this.name.last}`;
});

UserSchema.pre("save", function (next) {
  let user = this;
  if (user.subscribedAccount === undefined) {
    Subscriber.findOne({ email: user.email })
      .then(subscriber => {
        if (subscriber) {
          user.subscribedAccount = subscriber._id;

          // Also copy the courses from the subscriber to the user
          if (subscriber.courses && subscriber.courses.length > 0) {
            user.courses = subscriber.courses;
          }
        }
        next();
      })
      .catch(error => {
        console.log(`Error in pre-save subscriber association: ${error.message}`);
        next(error);
      });
  } else {
    next();
  }
});


module.exports = mongoose.model("User", UserSchema);