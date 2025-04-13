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
  },
  profilePicture: {
    type: String, // assume it will be a URL or local path
    default: ""   // or provide a default image path if needed
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
  if (!user.subscribedAccount) {
    Subscriber.findOne({ email: user.email })
      .then(subscriber => {
        if (subscriber) {
          user.subscribedAccount = subscriber._id;

          if (subscriber.courses && subscriber.courses.length > 0) {
            user.courses = subscriber.courses;
          }

          // 🔄 Set reverse reference
          subscriber.subscribedAccount = user._id;
          return subscriber.save(); // <--- Save reverse association too
        }
      })
      .then(() => next())
      .catch(error => {
        console.log(`Error in pre-save subscriber association: ${error.message}`);
        next(error);
      });
  } else {
    next();
  }
});


module.exports = mongoose.model("User", UserSchema);