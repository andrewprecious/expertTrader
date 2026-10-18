const jwt = require("jsonwebtoken");
const User = require("../models/user_model");

// this enforces strict authentication
const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt; // token is stored in a cookie named "jwt"
  if (!token) {
    return res.redirect("/login");
  }

  jwt.verify(token, "hello world12", (err, decodedToken) => {
    if (err) {
      // set error message in response locals(available to all views)
      res.locals.error = "invalid token";
      res.status(401).render("error", { title: "error" });
    }
    req.user = decodedToken; // include user information in request object

    next(); // proceed to next middleware/route
  });
};

// Check if there is a user: This middleware does'nt enforce strict authentication; it checks for the presence of a valid token and sets res.locals.user accordingly.
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "hello world12", async (err, decodedToken) => {
      if (err) {
        res.locals.user = null; // i.e user is empty- (available to all views)
        next();
      } else {
        // console.log(decodedToken);
        let user = await User.findById(decodedToken.id);
        res.locals.user = user; // (available to all views)
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

// loggedin users should not see login or register page
const redirectIfLoggedIn = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    // Try to verify the token
    jwt.verify(token, "hello world12", (err, decodedToken) => {
      if (!err) {
        // If the token is valid, redirect to the dashboard or another page
        res.redirect("users/dashboard");
        return;
      }
      if (err) {
        return next(); // if no token or invalid token, proceed to the login/registration page
      }
    });
  } else {
    // if there is no token,, proceed to the login/registration page
    next(); // Allow the request to continue
  }
};

// ensures user is verified
const ensureVerified = async (req, res, next) => {
  if (req.user) {
    const id = req.user.id;
    const user = await User.findById(id);
    if (user.isVerified) {
      next(); // Allow access
    } else {
      res.locals.error =
        "Kindly verify your email before accessing this resource. Kindly check your inbox or spam folder for the verification link we sent you.";
      res.status(401).render("error", { title: "error" });
    }
  }
};

module.exports = {
  verifyToken,
  checkUser,
  redirectIfLoggedIn,
  ensureVerified,
};
