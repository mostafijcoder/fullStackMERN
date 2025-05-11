// routes/apiRoutes.js
const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const errorController = require("../controllers/errorController");


// API route for getting courses as JSON
router.get("/courses", homeController.index, homeController.respondJSON);
// API route for joining a course
router.post("/courses/:id/join", homeController.joinCourse, errorController.errorJSON);


// JSON error handler
router.use(homeController.errorJSON);

module.exports = router;
