const express = require("express");
const router = express.Router();
const subscribersController = require("../controllers/subscribersController");

router.get("/", subscribersController.getAllSubscribers);
router.get("/searchByEmail", subscribersController.searchByEmail);
router.get("/searchByZip", subscribersController.searchByZip);
router.get("/:id", subscribersController.show);
router.get("/:id/edit", subscribersController.edit);
router.put("/:id", subscribersController.update);
router.delete("/:id", subscribersController.delete);

module.exports = router;

