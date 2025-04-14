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
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

// ✅ Virtual: Full name
UserSchema.virtual("fullName").get(function () {
  return `${this.name.first} ${this.name.last}`;
});

UserSchema.pre("save", async function (next) {
  const user = this;

  // Run only for new users or when email is changed
  if (user.isNew || user.isModified("email")) {
    try {
      const subscriber = await Subscriber.findOne({ email: user.email.toLowerCase() });
    
      if (subscriber) {
        user.subscribedAccount = subscriber._id;

        // Only copy if user.courses is empty
        if ((!user.courses || user.courses.length === 0) && subscriber.courses.length > 0) {
          user.courses = subscriber.courses;
        }

        // Also backlink the user to the subscriber
        if (!subscriber.subscribedAccount) {
          subscriber.subscribedAccount = user._id;
          await subscriber.save();
        }
        // ✅ Sync to User if available
        if (subscriber.subscribedAccount) {
          await user.findByIdAndUpdate(subscriber.subscribedAccount, {
            courses: subscriber.courses
          });
        }
      }

      next();
    } catch (error) {
      console.error("Error syncing subscriber data to user:", error);
      next(error);
    }
  } else {
    next();
  }
});


module.exports = mongoose.model("User", UserSchema);
