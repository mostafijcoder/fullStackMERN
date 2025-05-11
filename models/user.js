const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Subscriber = require("./subscriber");
const passportLocalMongoose = require("passport-local-mongoose");

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

// ✅ Sync Subscriber on user creation
UserSchema.pre("save", async function (next) {
  const user = this;

  if (user.isNew || user.isModified("email")) {
    try {
      let subscriber = await Subscriber.findOne({ email: user.email.toLowerCase() });

      if (!subscriber) {
        subscriber = await Subscriber.create({
          name: `${user.name.first} ${user.name.last}`,
          email: user.email,
          zipCode: user.zipCode,
          courses: user.courses,
          subscribedAccount: user._id
        });
      } else {
        // Link subscriber to user
        if (!subscriber.subscribedAccount) {
          subscriber.subscribedAccount = user._id;
          await subscriber.save();
        }

        // Sync courses if user has none
        if ((!user.courses || user.courses.length === 0) && subscriber.courses.length > 0) {
          user.courses = subscriber.courses;
        }
      }

      // Link user to subscriber
      user.subscribedAccount = subscriber._id;

      next();
    } catch (error) {
      console.error("Error syncing subscriber data to user:", error);
      next(error);
    }
  } else {
    next();
  }
});

// ✅ Passport plugin: manage hashing + login with email
UserSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});

module.exports = mongoose.model("User", UserSchema);
