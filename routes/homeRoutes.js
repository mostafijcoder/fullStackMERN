const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

router.get("/", homeController.homePage);
router.get("/courses", homeController.showCourses);
router.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact Us", showNotification: true });
});

module.exports = router;
