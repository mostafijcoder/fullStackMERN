const randToken = require("rand-token");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Subscriber = require("./subscriber");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  name: {
    first: { type: String, trim: true, required: true },
    last: { type: String, trim: true, required: true }
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
  },
  apiToken: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

UserSchema.virtual("fullName").get(function () {
  return `${this.name.first} ${this.name.last}`;
});

// ✅ Combined single pre-save hook
UserSchema.pre("save", async function (next) {
  try {
    // 1. Generate apiToken if missing
    if (!this.apiToken) {
      let token;
      let existingUser;
      do {
        token = randToken.generate(16);
        existingUser = await mongoose.model("User").findOne({ apiToken: token });
      } while (existingUser);
      this.apiToken = token;
    }

    // 2. Sync with Subscriber if new or email changed
    if (this.isNew || this.isModified("email")) {
      let subscriber = await Subscriber.findOne({ email: this.email.toLowerCase() });

      if (!subscriber) {
        subscriber = await Subscriber.create({
          name: `${this.name.first} ${this.name.last}`,
          email: this.email,
          zipCode: this.zipCode,
          courses: this.courses,
          subscribedAccount: this._id
        });
      } else {
        if (!subscriber.subscribedAccount) {
          subscriber.subscribedAccount = this._id;
          await subscriber.save();
        }

        if ((!this.courses || this.courses.length === 0) && subscriber.courses.length > 0) {
          this.courses = subscriber.courses;
        }
      }

      this.subscribedAccount = subscriber._id;
    }

    next();
  } catch (error) {
    console.error("Error in user pre-save:", error);
    next(error);
  }
});

UserSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});

module.exports = mongoose.model("User", UserSchema);
