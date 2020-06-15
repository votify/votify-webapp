var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/register", (req, res) => {
  res.render("register", { layout: "layout" });
});

router.post("/register", (req, res) => {
});

router.get("/check-register", (req, res) => {
  res.render("check-register", { layout: "layout" });
});

router.post("/check-register", (req, res) => {
  res.render("check-register", { layout: "layout" });
});

module.exports = router;
