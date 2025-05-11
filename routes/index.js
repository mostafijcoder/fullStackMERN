const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const subscriberRoutes = require("./subscriberRoutes");
const contactRoutes = require("./contactRoutes");
const enrollRoutes = require("./enrollRoutes");
const homeRoutes = require("./homeRoutes");
const errorRoutes = require("./errorRoutes");
const apiRoutes = require("./apiRoutes");


router.use("/api", apiRoutes);
router.use("/", homeRoutes);
router.use("/users", userRoutes);
router.use("/subscribers", subscriberRoutes);
router.use("/contacts", contactRoutes);
router.use("/enroll", enrollRoutes);


// Always last
router.use(errorRoutes);

module.exports = router;
