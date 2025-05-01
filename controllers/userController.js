// controllers/usersController.js
const User = require("../models/user");
const Subscriber = require("../models/subscriber");
const Course = require("../models/course");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });
exports.upload = upload.single("profilePicture");

// GET: All users
exports.index = async (req, res) => {
  const users = await User.find().populate("courses");
  res.render("users/index", { users, title: "Users" });
};

// GET: New user form
exports.new = (req, res) => {
  res.render("users/new", { title: "New User", messages: req.flash() });
};

// POST: Register new user
exports.create = async (req, res, next) => {
  try {
    let userParams = {
      name: {
        first: req.body.firstName,
        last: req.body.lastName
      },
      email: req.body.email,
      zipCode: req.body.zipCode,
      isAdmin: req.body.isAdmin === "on"
    };
    
    // Handle captured image or file upload
    if (req.body.capturedImage) {
      // Save base64 image as file
      const base64Data = req.body.capturedImage.replace(/^data:image\/jpeg;base64,/, "");
      const fileName = `${Date.now()}-captured.jpg`;
      const filePath = path.join("public/uploads", fileName);
      fs.writeFileSync(filePath, base64Data, "base64");
      userParams.profilePicture = `/uploads/${fileName}`;
    } else if (req.file) {
      userParams.profilePicture = `/uploads/${req.file.filename}`;
    }

    if (!userParams.profilePicture) {
      userParams.profilePicture = "/images/cakes"; // assuming you have this in public/images/
    }
    
    const newUser = new User(userParams);
    await User.register(newUser, req.body.password); // thanks to passport-local-mongoose

    req.flash("success", "Account created! You may now log in.");
    res.redirect("/users/login");
  } catch (error) {
    console.error("Registration Error:", error);
    req.flash("error", error.message);
    res.redirect("/users/new");
  }
};

// GET: Login form
exports.login = (req, res) => {
  res.render("users/login", {
    title: "Login",
    messages: req.flash(),
    currentUser: req.user,
    layout:false
  });
};

// POST: Handle login (passport.authenticate is used in route)

// GET: Show user profile
exports.show = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("courses");
    res.render("users/show", { user, title: `${user.fullName}'s Profile` });
  } catch (err) {
    console.error(err);
    req.flash("error", "User not found.");
    res.redirect("/users");
  }
};

// GET: Edit user form
exports.edit = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.render("users/edit", { user, title: "Edit User" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Edit page failed to load.");
  }
};

// PUT: Update user
exports.update = async (req, res) => {
  try {
    const updateData = {
      name: {
        first: req.body.firstName,
        last: req.body.lastName
      },
      email: req.body.email,
      zipCode: req.body.zipCode,
      isAdmin: req.body.isAdmin === "on"
    };

    if (req.file) {
      updateData.profilePicture = `/uploads/${req.file.filename}`;
    }
    const existingUser = await User.findById(req.params.id);
    if (req.file && existingUser.profilePicture && existingUser.profilePicture.startsWith("/uploads")) {
      const oldPath = path.join("public", existingUser.profilePicture);
      fs.unlink(oldPath, err => {
        if (err) console.error("Failed to delete old image:", err);
      });
    }
    
    await User.findByIdAndUpdate(req.params.id, updateData);
    req.flash("success", "User updated successfully.");
    res.redirect(`/users/${req.params.id}`);
  } catch (err) {
    console.error("Update error:", err);
    req.flash("error", "Update failed.");
    res.redirect(`/users/${req.params.id}/edit`);
  }
};

// DELETE: Remove user
exports.delete = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
  if (user.profilePicture && user.profilePicture.startsWith("/uploads")) {
  const filePath = path.join("public", user.profilePicture);
  fs.unlink(filePath, err => {
    if (err) console.error("Error deleting profile picture:", err);
  });
}
await User.findByIdAndDelete(req.params.id);

    await User.findByIdAndDelete(req.params.id);
    req.flash("success", "User deleted.");
    res.redirect("/users");
  } catch (err) {
    req.flash("error", "User could not be deleted.");
    res.redirect("/users");
  }
};

// POST: Logout
exports.logout = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash("success", "Logged out successfully.");
    res.redirect("/");
  });
};
// GET: Current user's profile
exports.profile = async (req, res) => {
  try {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      req.flash("error", "You need to log in to view your profile.");
      return res.redirect("/users/login");
    }

    const user = await User.findById(req.user._id).populate("courses");

    res.render("users/show", {
      user,
      title: "My Profile"
    });
  } catch (err) {
    console.error("Profile view error:", err);
    req.flash("error", "Unable to load your profile.");
    res.redirect("/");
  }
};
