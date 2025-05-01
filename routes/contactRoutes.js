const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

router.post("/", contactController.saveContact);
router.get("/", contactController.getAllContacts);
router.get("/search", contactController.searchByEmail);

module.exports = router;
