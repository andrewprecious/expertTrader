const express = require("express");
// Import routes
const app_route = require("./routes/app_route");
const user_route = require("./routes/user_route");
const auth_route = require("./routes/auth_route");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { checkUser } = require("./middlewares/verifyToken");
// env
require("dotenv").config();

const app = express();
const port = process.env.PORT;

// set static middleware files
app.use(express.static("public"));

// use cookie-parser
app.use(cookieParser());

// use express json
app.use(express.json());

// url encoded
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.URL)
  .then(() => {
    console.log("Connceted successfully");

    // listening to server
    app.listen(port, () => {
      console.log(`Listening to request coming from port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// set view engine
app.set("view engine", "ejs");

// Use routes
app.use("*", checkUser);
app.use(app_route);
app.use("/users", user_route);
app.use("/account", auth_route);
