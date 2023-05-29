const express = require("express");
const UserTrivia = require("../Models/UserTrivia");
const Post = require("../Models/Post");

const accountPageRouter = express.Router();

async function followAccount(visitedUsername, loggedInUsername) {
  await UserTrivia.findOneAndUpdate(
    { username: visitedUsername },
    {
      $push: { followers: loggedInUsername },
    }
  );

  await UserTrivia.findOneAndUpdate(
    { username: loggedInUsername },
    {
      $push: { following: visitedUsername },
    }
  );
}

async function unFollowAccount(visitedUsername, loggedInUsername) {
  await UserTrivia.findOneAndUpdate(
    { username: visitedUsername },
    {
      $pull: { followers: loggedInUsername },
    }
  );

  await UserTrivia.findOneAndUpdate(
    { username: loggedInUsername },
    {
      $pull: { following: visitedUsername },
    }
  );
}
async function getFollowingList(loggedInUsername) {
  const following = await UserTrivia.findOne(
    {
      username: loggedInUsername,
    },
    { following: 1 }
  ).lean();
  return following;
}

accountPageRouter.get("/:username", async (req, res, next) => {
  const userDetails = await UserTrivia.findOne(
    {
      username: req.params.username,
    },
    {
      bio: 1,
      firstName: 1,
      lastName: 1,
      username: 1,
      followers: 1,
      following: 1,
      avatarURL:1,
      posts:1
    }
  ).lean();

  const posts = await Post.find({username: req.params.username}).lean();
  return res.status(200).json({
    message: "Success",
    userDetails,
    posts
  });
});

accountPageRouter.put("/follow/:username", async (req, res, next) => {
  try {
    const loggedInUsername = req.body.username;
    const visitedUsername = req.params.username;
    await followAccount(visitedUsername, loggedInUsername);
    const following = await getFollowingList(loggedInUsername);

    return res.status(200).json({
      message: "Success",
      ...following,
    });
  } catch (e) {
    console.log(e);
  }
});

accountPageRouter.put("/unfollow/:username", async (req, res, next) => {
  try {
    const loggedInUsername = req.body.username;
    const visitedUsername = req.params.username;

    await unFollowAccount(visitedUsername, loggedInUsername);
    const following = await getFollowingList(loggedInUsername);

    return res.status(200).json({
      message: "Success",
      ...following,
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = accountPageRouter;
