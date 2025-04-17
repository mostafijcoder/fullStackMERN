// controllers/usersController.js
const User = require("../models/user");
const Subscriber = require("../models/subscriber");
const Course = require("../models/course");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });
exports.upload = upload.single("profilePicture");

exports.index = async (req, res) => {
  const users = await User.find().populate("courses");
  res.render("users/index", { users, title: "Users" });
};

exports.new = (req, res) => {
  res.render("users/new", { title: "New User" });
};

exports.create = async (req, res) => {
  try {
    let profilePath = null;
    if (req.file) {
      profilePath = `/uploads/${req.file.filename}`;
    } else if (req.body.capturedImage) {
      const base64Data = req.body.capturedImage.replace(/^data:image\/jpeg;base64,/, "");
      const fileName = `capture-${Date.now()}.jpg`;
      const filePath = path.join("public/uploads", fileName);
      fs.writeFileSync(filePath, base64Data, "base64");
      profilePath = `/uploads/${fileName}`;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      name: {
        first: req.body.firstName,
        last: req.body.lastName
      },
      email: req.body.email,
      password: hashedPassword,
      zipCode: req.body.zipCode,
      isAdmin: req.body.isAdmin === "on",
      profilePicture: profilePath
    });

    await newUser.save();
    req.flash("success", "Account created successfully. Please log in.");
    res.redirect("/users/login");
  } catch (err) {
    req.flash("error", "Failed to create account. Please try again.");
    console.error("Error creating user:", err);
    res.redirect("/users/new");
  }
};

exports.login = (req, res) => {
  res.render("users/login", { title: "Login" });
};

exports.authenticate = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      req.flash("success", `Welcome back, ${user.name.first}!`);
      res.locals.redirect = `/users/${user._id}`;
    } else {
      req.flash("error", "Your account or password is incorrect. Please try again or contact your system admin.");
      res.locals.redirect = "/users/login";
    }
    next();
  } catch (err) {
    console.error("Login error:", err);
    next(err);
  }
};

exports.redirectView = (req, res) => {
  const redirectPath = res.locals.redirect || "/";
  res.redirect(redirectPath);
};

exports.show = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("courses");
    res.render("users/show", { user, title: "User Profile" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user details");
  }
};

exports.edit = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render("users/edit", { user, title: "Edit User" });
};

exports.update = async (req, res) => {
  try {
    const updateData = {
      fullName: req.body.fullName,
      email: req.body.email,
      zipCode: req.body.zipCode,
      isAdmin: req.body.isAdmin === "on",
    };

    if (req.file) {
      updateData.profilePicture = `/uploads/${req.file.filename}`;
    }

    await User.findByIdAndUpdate(req.params.id, updateData);
    res.redirect(`/users/${req.params.id}`);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).send("Update failed");
  }
};

exports.delete = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect("/users");
};
