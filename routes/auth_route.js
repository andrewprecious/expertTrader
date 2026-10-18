const express = require("express");
const router = express.Router();
const User = require("../models/user_model");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");

// Regualr expression for password complexity
// const PASSWORD_REGEX =
// const PASSWORD_REGEX =
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  host: "mail.expertsfxtrade.com",
  port: 465, // use out going server smtp port
  auth: {
    user: "expertsfxtrade@expertsfxtrade.com",
    pass: "ExpertFx@30",
  },
});

// Function to send verification emails
const sendVerificatonEmail = (userEmail, verificationToken) => {
  const verificationLink = `http://localhost:3000/account/verify-email/${verificationToken}`;

  const mailOptions = {
    from: "expertsfxtrade@expertsfxtrade.com",
    to: userEmail,
    subject: "Email verification",
    html: `<h2> Welcome to Expert Fx Trade </h2>
           <p> Thank you for registering. Please verify your email by clicking the link below:</p>
           <a href="${verificationLink}"> Verify Email </a>`,
  };

  // return transporter.sendMail(mailOptions)
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending verification email:", err); // Log the error
    } else {
      console.log("Verification email sent successfully:", info.response); // Log the success response
    }
  });
};

// Send login success email
const sendLoginSuccessEmail = (userEmail, User) => {
  const mailOptions = {
    from: "mail.expertsfxtrade.com",
    to: userEmail,
    subject: "Login Success",
    html: `<h2> Login Success </h2>
    <p> Dear ${User.fname} You have successfully logged into your account. If you do not recognize this action, KIndly contact support immdeiately </p>
    <a href="http://localhost:3000/contact"> Contact Support<a/>`,
  };

  // return transporter.sendMail(mailOption)
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info.response);
    }
  });
};

// register
router.post("/register", async (req, res) => {
  try {
    // destructure these inputs from the form (req.body)
    const { fname, lname, email, country, password, confirmPassword, agree } =
      req.body;

    // checking if the user fill all inputs
    if (
      !fname ||
      !lname ||
      !email ||
      !country ||
      !password ||
      !confirmPassword ||
      !agree
    ) {
      return res.status(400).json({ error: "All fields must be filled" });
    }

    // checking if the email is already existing
    const emailIsExisting = await User.findOne({ email: email });
    if (emailIsExisting) {
      return res.status(401).json({ error: "Email is already in use" });
    }

    // check if the email has the default email sign e.g(@gmail.com)
    if (!validator.isEmail(email)) {
      return res.status(401).json({ error: "email is not valid" });
    }

    // checks
    // console.log("Submitted password:", password);
    // if (!validator.matches(password, PASSWORD_REGEX)) {
    //   console.log("Password validation failed");
    //   return res.status(401).json({
    //     error:
    //       "Password minimum length is 8 characters and must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
    //   });
    // }

    // checks if the password matches confirm password
    if (password !== confirmPassword) {
      return res.status(401).json({ error: "Passwords do not match" });
    }

    // Generate a unique verificaton token
    const verificationToken = uuidv4();

    const newUser = new User({
      fname: fname,
      lname: lname,
      email: email,
      country: country,
      password: password,
      agree: agree,
      verificationToken: verificationToken, // Store the unique token
    });

    const saveUser = await newUser.save();

    // Send a verification email to the user
    sendVerificatonEmail(email, verificationToken);

    res.status(201).json(saveUser);
  } catch (error) {
    console.log(error);
    if (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
});

// login starts
router.post("/login", async (req, res) => {
  try {
    // console.log(req.body);
    // destructure the email and password from the form
    const { email, password } = req.body;

    // checks if all field are filled
    if (!email || !password) {
      return res.status(400).json({ error: "All fields must be filled" });
    }

    // checks if email is registered
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "email is not registered" });
    }

    // checks if the password matches with the one the user registered with
    const isPasswordCorrect = user.password === password;

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "wrong credentials" });
    }

    // create access token with jwt
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      "hello world12",
      { expiresIn: "1d" }
    );

    // set (jwt) as a cookie in the response
    const maxAge = 86400; // 1 day in seconds
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: maxAge * 1000 });

    // Send a login success email to user
    sendLoginSuccessEmail(email, user);

    // Respond with user ID
    res.status(200).json({ user: user._id });
  } catch (error) {
    console.log(error);
  }
});

// Route to handle email verification
router.get("/verify-email/:token", async (req, res) => {
  const { token } = req.params; // Get the token from the route parameters

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      res.locals.error = "Invalid Token or Token has expired";
      // Render the rror message in the EJS template
      res.status(400).render("error", { title: "error" });
      return;
    }

    user.isVerified = true; // Mark the user as verified
    user.verificationToken = null; // Clear the token to prevent reuse
    await user.save();
    res.locals.success = "Email Verified Successfully";
    // Render the success message in the EJS template
    res.status(400).render("success", { title: "success" });
  } catch (err) {
    console.error("Error during email verifcaton:", err);
    res.locals.error = "Internal server error";
    // Render the success message in the EJS template
    res.status(400).render("error", { title: "error" });
  }
});

module.exports = router;
