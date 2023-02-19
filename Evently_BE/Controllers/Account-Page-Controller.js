const express = require("express");
const UserTrivia = require("../Models/UserTrivia");
const accountPageRouter = express.Router();

accountPageRouter.get("/:username/followers", (req, res, next) => {
  console.log("fetching followers")
  return res.status(200).json(usernames);
});

accountPageRouter.get("/:username/following", (req, res, next) => {
  return res.status(200).json(usernames);
});

accountPageRouter.get("/:username/", async (req, res, next) => {
  console.log("received req");
  const userDetails = await UserTrivia.findOne({username:req.params.username})
  console.log(userDetails)
  return res.status(200).json({
    message: "Success",
    userDetails
  })
});

module.exports = accountPageRouter;
