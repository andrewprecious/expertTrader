const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/verifyToken");
// const { verifyToken, ensureVerified } = require("../middlewares/verifyToken");
const User = require("../models/user_model");
const Deposit = require("../models/depositModel");
const multer = require("multer");
const mongoose = require("mongoose");

// ========> USER SIDE  ===========>

// set up multer for deposit
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./depositUploads"); // Set your upload folder
  },

  // unique names for my files
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniquePrefix + "-" + file.originalname);
  },
});

let upload = multer({
  storage: storage,
}).single("proofOfPayment"); // use the correct field name

// dashboard
router.get("/dashboard", verifyToken, async (req, res) => {
  try {
    const loggedInUser = req.user; // decoded user from jwt (contain id and isAdmin)
    // console.log(loggedInUser);

    res.render("users/dashboard", { title: "User-Dashboard" });
  } catch (err) {
    console.log(err);
    res.locals.error = "internal server error";
    //  Render the error message in the EJS template
    res.status(500).render("error", { title: "error" });
  }
});

// router.get("/dashboard", verifyToken, ensureVerified, async (req, res) => {
//   try {
//     const loggedInUser = req.user; - decoded user from jwt (contain id and isAdmin)
//     - console.log(loggedInUser);

//     res.render("users/dashboard", { title: "User-Dashboard" });
//   } catch (err) {
//     console.log(err);
//     res.locals.error = "internal server error";
//     - Render the error message in the EJS template
//     res.status(500).render("error", { title: "error" });
//   }
// });

// deposit
router.get("/deposit", (req, res) => {
  res.render("users/deposit", { title: "Deposit" });
});

// deposit
router.get("/deposit/:userId", upload, async (req, res) => {
  const id = req.params.userId;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.redirect("/");
    return;
  }

  try {
    const deposit = new Deposit({
      payment: req.body.payment,
      amount: req.body.amount,
      proofOfPayment: req.file.filename,
    });
    const savedDeposit = await deposit.save();
    // console.log(savedDeposit);

    try {
      // push deposit id into deposit array of the user
      await User.findByIdAndUpdate(id, {
        $push: { deposits: savedDeposit._id },
      });
    } catch (err) {
      console.log(err);
      res.locals.error = "internal server error. Try again later";
      // Render the error message in the EJS template
      res.status(500).render("error", { title: "error" });
    }

    res.status(201).send({ message: "Deposit successful!" });
  } catch (err) {
    console.log(err);
    res.locals.error = "internal server error. Try again later";
    // Render the error message in the EJS template
    res.status(500).render("error", { title: "error" });
  }
});

// investment;
router.get("/investment-package", (req, res) => {
  res.render("users/investment-package", { title: "Investment" });
});

// trade logs
router.get("/tradeLogs", (req, res) => {
  res.render("users/tradeLogs", { title: "trade logs" });
});

// trade logs
router.get("/transactionHistory", (req, res) => {
  res.render("users/transactionHistory", { title: "transaction logs" });
});

// withdrawl
router.get("/withdrawl", (req, res) => {
  res.render("users/withdrawl", { title: "Withdrawl" });
});

// settings
router.get("/settings", (req, res) => {
  res.render("users/settings", { title: "Settings" });
});

module.exports = router;
