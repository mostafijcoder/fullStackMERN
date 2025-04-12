const User = require("../models/user");

module.exports = {
  new: (req, res) => {
    res.render("users/new", { title: "New User" });
  },

  create: async (req, res) => {
    try {
      const user = await User.create(req.body);
      res.redirect(`/users/${user._id}`);
    } catch (err) {
      console.error(err);
      res.render("users/new", { title: "New User", error: err.message });
    }
  },

  index: async (req, res) => {
    const users = await User.find();
    res.render("users/index", { users, title: "All Users" });
  },

  show: async (req, res) => {
    const user = await User.findById(req.params.id).populate("courses");
    res.render("users/show", { user, title: user.fullName });
  },

  edit: async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render("users/edit", { user, title: "Edit User" });
  },

  update: async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.params.id, req.body);
      res.redirect(`/users/${req.params.id}`);
    } catch (err) {
      console.error(err);
      res.redirect("/users");
    }
  },

  delete: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.redirect("/users");
    } catch (err) {
      console.error(err);
      res.redirect("/users");
    }
  }
};

exports.redirectView = (req, res, next) => {
  let redirectPath = res.locals.redirect;
  if (redirectPath) res.redirect(redirectPath);
  else next();
};
