const express = require("express");
const router = express.Router();
const { redirectIfLoggedIn } = require("../middlewares/verifyToken");

router.get("/", (req, res) => {
  res.render("home", { title: "Home page" }); // Ensure this matches the view filename
});

router.get("/heatMapPage", (req, res) => {
  res.render("heatMapPage", { title: "Heat page" });
});

router.get("/crossRates", (req, res) => {
  res.render("crossRates", { title: "Cross page" });
});

router.get("/charts", (req, res) => {
  res.render("charts", { title: "charts page" });
});

// about route
router.get("/about", (req, res) => {
  res.render("about", { title: "about page" });
});

// contact
router.get("/contact", (req, res) => {
  res.render("contact", { title: "contact page" });
});

// register
router.get("/register", redirectIfLoggedIn, (req, res) => {
  res.render("register", { title: "register page" });
});

// login
router.get("/login", redirectIfLoggedIn, (req, res) => {
  res.render("login", { title: "login page" });
});

// logout
router.get("/logout", (req, res) => {
  //  this replaces the token value. Once there is no jwt, we are loggedout
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/login");
});

module.exports = router;
