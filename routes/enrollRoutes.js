const express = require("express");
const router = express.Router();
const subscribersController = require("../controllers/subscribersController");

router.get("/", subscribersController.getEnrollmentPage);
router.post("/", subscribersController.saveSubscriberAndEnrollCourse);

module.exports = router;
