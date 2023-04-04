const express = require("express");
const searchRouter = express.Router();
const {searchUsers} = require("../Services/db_queries/User_queries");

searchRouter.get("/search/:keyword", async (req, res, next) => {
  const keyword = req.params.keyword;

  let usersFound = await searchUsers(keyword)
  console.log(usersFound)
  return res.status(200).json({
    usersFound
  });
});

module.exports = searchRouter;