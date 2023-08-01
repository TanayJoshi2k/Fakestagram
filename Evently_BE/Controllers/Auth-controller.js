const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const limiter = require("../Services/Rate-Limiter");
const multer = require("multer");
const UserTrivia = require("../Models/UserTrivia");
const User = require("../Models/User");
const Tokens = require("../Models/Token");
require("../Models/db");
const sendMail = require("../Services/Mail-Service");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("avatar");
const ImageUpload = require("../Services/Image-Upload-Service");
global.XMLHttpRequest = require("xhr2");

const DEFAULT_AVATAR =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png";

const authRouter = express.Router();

authRouter.get("/isAuth", async (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.status(401).json({
      message: "",
      error: {
        authorized: false,
      },
    });
  }
  try {
    const user = await UserTrivia.findOne(
      {
        username: req.session.username,
      },
      { _id: 0, __v: 0 }
    ).lean();
    return res.status(200).json({
      message: { authorized: true, username: req.session.username, ...user },
      error: { authorized: false },
    });
  } catch (e) {
    return res.status(500).json({ error: "Internal Serve Error" });
  }
});

authRouter.post("/login", limiter, async (req, res, next) => {
  try {
    const user = req.body;
    let error_message = "";
    const userFound = await User.findOne({ username: user.username });
    if (!userFound) {
      error_message = "User does not exist";
    } else if (!(await bcrypt.compare(user.password, userFound.password))) {
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

    const confirmedDetails = userFound.confirmedDetails;

    if (!confirmedDetails) {
      return res.status(404).json({
        confirmedDetails: false,
      });
    }

    const userDetails = await UserTrivia.findOne(
      {
        username: user.username,
      },
      { _id: 0, __v: 0 }
    ).lean();

    req.session.isLoggedIn = true;
    req.session.username = user.username;
    return res.status(200).json({
      message: {
        text: "Success",
        username: user.username,
        authorized: true,
        ...userDetails,
      },
    });
  } catch (e) {
    return res.status(500).json({
      error: {
        error_message: "Internal Server Error",
      },
    });
  }
});

authRouter.post("/signup", async (req, res, next) => {
  const user = req.body;
  const formErrors = { usernameError: "", passwordError: "", emailError: "" };
  console.log(user)
  if (user.username.trim().length === 0) {
    formErrors.usernameError = "Username cannot be empty";
  }
  if (user.username.trim().length < 3) {
    formErrors.usernameError = "Username should be at least 3 characters";
  }

  if (/[^-_.a-zA-Z0-9]/.test(user.username)) {
    formErrors.usernameError =
      "No special characters except hyphens, underscores and periods.";
  }

  if (user.password.length < 6) {
    formErrors.passwordError = "Password must be at least 6 characters";
  }
  
  if (user.password.length === 0) {
    formErrors.passwordError = "Password cannot be empty";
  }

  const takenEmail = await User.findOne({ email: user.email });
  if (takenEmail) {
    formErrors.emailError = "An account already exists with this email";
  }

  const takenUsername = await User.findOne({ username: user.username });
  if (takenUsername) {
    formErrors.usernameError = "This username is taken";
  }

  if (
    formErrors.usernameError ||
    formErrors.passwordError ||
    formErrors.emailError
  ) {
    return res.status(400).json({
      error: {
        usernameError: formErrors.usernameError,
        passwordError: formErrors.passwordError,
        emailError: formErrors.emailError,
      },
    });
  }
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(user.password, salt);

  const newUser = await new User({
    email: user.email,
    username: user.username,
    password: hashedPassword,
  }).save();

  const token = await new Tokens({
    userId: newUser._id,
    token: crypto.randomBytes(32).toString("hex"),
  }).save();

  const url = `${process.env.BASE_URL}users/${newUser._id}/verify/${token.token}`;
  await sendMail(user.email, "Verify Email", url);

  return res.status(201).json({
    message: "Verification Link is sent to your inbox",
  });
});

authRouter.post("/logout", (req, res, next) => {
  req.session.destroy((e) => {
    console.log(e);
  });

  return res.json({ message: "Logged out" });
});

authRouter.get("/users/:user_id/verify/:token", async (req, res, next) => {
  try {
    const user = await User.findById({ _id: req.params.user_id });
    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    const token = await Tokens.findOne({
      userId: req.params.user_id,
      token: req.params.token,
    });
    if (!token) {
      return res.status(400).json({ error: "Invalid Token/Link" });
    }
    await User.findOneAndUpdate({ _id: user._id }, { verified: true });
    await token.remove();

    return res.status(201).json({
      message: "Email Verified",
    });
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log(e);
  }
});

authRouter.post("/secondSignupStep", upload, async (req, res, next) => {
  try {
    const file = req.file;
    downloadURL =
      (await ImageUpload(file, req.body.username, "avatar")) || DEFAULT_AVATAR;
    await new UserTrivia({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      bio: req.body.bio,
      gender: req.body.gender,
      avatarURL: downloadURL,
    }).save();

    await User.findOneAndUpdate(
      { username: req.body.username },
      { $set: { confirmedDetails: true } }
    );

    return res.status(203).json({
      message: "Details confirmed. Success.",
    });
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" });
    console.log(e);
  }
});

module.exports = authRouter;
