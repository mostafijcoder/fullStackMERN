const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/userController");

// ✅ Auth Routes
router.get("/login", userController.login);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/users/profile",
    failureRedirect: "/users/login",
    failureFlash: true
  })
);
router.get("/logout", userController.logout);

// ✅ User Routes
router.get("/", userController.index);
router.get("/new", userController.new);
router.post("/", userController.upload, userController.create);
router.get("/profile", userController.profile); // current user profile
router.get("/:id", userController.show);
router.get("/:id/edit", userController.edit);
router.put("/:id", userController.upload, userController.update);
router.delete("/:id", userController.delete);

module.exports = router;
