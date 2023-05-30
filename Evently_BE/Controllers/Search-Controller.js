const express = require("express");
const searchRouter = express.Router();
const { searchUsers } = require("../Services/db_queries/User_queries");
const UserTrivia = require("../Models/UserTrivia");

searchRouter.get("/search/:keyword", async (req, res, next) => {
  const keyword = req.params.keyword;
  let usersFound = await searchUsers(keyword);
  return res.status(200).json({
    usersFound,
  });
});

searchRouter.get("/suggestions", async (req, res, next) => {

  let result = await UserTrivia.findOne(
    { username: req.session.username },
    { _id: 0, following: 1 }
  ).lean();
  result.following.push(req.session.username);

  const random = await UserTrivia.aggregate([
    {
      $match: {
        username: { $nin: result.following.map((username) => username) },
      },
    },

    { $sample: { size: 3 } },
    {
      $project: {
        _id: 0,
        username: 1,
        avatarURL: 1,
        firstName: 1,
        lastName: 1,
      },
    },
  ]);

  res.json({ suggestions: random });
});

module.exports = searchRouter;
