const express = require("express");
const router = express.Router();

router.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("500", { title: "Server Error" });
});

module.exports = router;
