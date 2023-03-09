const express = require("express");
const UserTrivia = require("../Models/UserTrivia");
const Events = require("../Models/Events");
const searchRouter = express.Router();

searchRouter.get("/search/:keyword", async (req, res, next) => {
  const keyword = req.params.keyword;

  let usersFound = await UserTrivia.find(
    {
      username: { $regex: "^" + keyword, $options: "i" },
    },
    { username: 1, avatarURL: 1, _id: 0 }
  ).lean();

  usersFound = usersFound.map(user => {
    return {...user, type:"user"}
  })

  let eventsFound = await Events.find(
    {
      title: { $regex: "^" + keyword, $options: "i" },
    },
    { title: 1, _id: 0 }
  ).lean();

  eventsFound = eventsFound.map(event => {
    return {...event, type:"event"}
  })

  let searchResults = usersFound.concat(eventsFound)

  return res.status(200).json({
    searchResults
  });
});

module.exports = searchRouter;
