const express = require("express");
const User = require("../Models/User");

const authRouter = express.Router();

authRouter.post("/login", async (req, res, next) => {
  console.log("Received login request", req.body);
  const user = req.body;
  let error_message = "";
  const userFound = await User.findOne({ username: user.username });

  if (!userFound || user.password !== userFound.password) {
    error_message = "Wrong username and/or password";
  }

  if (error_message !== "") {
    return res.status(400).json({
      error: {
        error_message,
        isAuth: false,
      },
    });
  }

  req.session.isLoggedIn = true;
  req.session.username = user.username;
  res.status(200).json({
    message: {
      text: "Success",
      isAuth: true,
    },
  });
});

authRouter.post("/signup", async (req, res, next) => {
  const user = req.body;
  const formErrors = { usernameError: "", passwordError: "" };

  if (user.username.trim().length === 0) {
    formErrors.usernameError = "Username cannot be empty";
  }
  if (user.password.length < 6) {
    formErrors.passwordError = "Password must be at least 6 characters";
  }
  if (user.password.length === 0) {
    formErrors.passwordError = "This field cannot be empty";
  }

  const takenUsername = await User.findOne({ username: user.username });

  if (takenUsername) {
    formErrors.usernameError = "Username already taken";
  }

  if (formErrors.usernameError || formErrors.passwordError) {
    console.log(formErrors);

    return res.status(400).json({
      message: {
        usernameError: formErrors.usernameError,
        passwordError: formErrors.passwordError,
      },
    });
  }
  const newUser = new User({
    username: user.username,
    password: user.password,
  });

  newUser.save((err, user) => {
    if (err) {
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  });

  res.json({ message: "Record created successfully" });
});

authRouter.post("/logout", (req, res, next) => {
  req.session.destroy((e) => {
    console.log(e);
  });

  res.json({ message: "Logged out" });
});

module.exports = authRouter;
