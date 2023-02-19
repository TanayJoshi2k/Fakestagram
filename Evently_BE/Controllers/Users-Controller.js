const express = require("express");
const User = require("../Models/User");

const usersRouter = express.Router();

usersRouter.get("/user/:username", async (req, res, next) => {
  const username = req.params.username;
  const start = Date.now();
  let usersFound = await User.find({
    username: { $regex: "^" + username, $options: "i" },
  });
  return res.status(200).json({
    usersFound,
  });
});

module.exports = usersRouter;
