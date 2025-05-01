const express = require("express");
const router = express.Router();
const courseController = require("../controllers/coursesController");

// Course Routes
router.get("/", courseController.index, courseController.indexView);
router.get("/new", courseController.new);
router.post("/", courseController.create);
router.get("/:id", courseController.show);
router.get("/:id/edit", courseController.edit);
router.put("/:id", courseController.update);
router.delete("/:id", courseController.delete);

module.exports = router;
