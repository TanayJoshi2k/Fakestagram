// const express = require("express");
// const UserTrivia = require("../Models/UserTrivia");
// const Events = require("../Models/Events");
// const usersRouter = express.Router();

// usersRouter.get("/:username", async (req, res, next) => {
//   const username = req.params.username;

//   let usersFound = await UserTrivia.find(
//     {
//       username: { $regex: "^" + username, $options: "i" },
//     },
//     { username: 1, avatarURL: 1, _id: 0 }
//   ).lean();

//   let eventsFound = await Events.find(
//     {
//       title: { $regex: "^" + username, $options: "i" },
//     },
//     { title:1}
//   ).lean();

//   console.log(eventsFound)

//   return res.status(200).json({
//     usersFound,
//   });
// });

// module.exports = usersRouter;
