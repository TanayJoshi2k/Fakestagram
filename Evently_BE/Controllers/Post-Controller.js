const express = require("express");
const UserTrivia = require("../Models/UserTrivia");
const Post = require("../Models/Post");
const postRouter = express.Router();
require("../Models/db");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("post");

const ImageUpload = require("../Services/Image-Upload-Service");
global.XMLHttpRequest = require("xhr2");

async function getPostComments(postId) {
  const comments = await Post.findById(
    {
      _id: postId,
    },
    { comments: 1 }
  ).lean();
  return comments;
}

postRouter.get("/", async (req, res, next) => {
  try {
    const posts = await Post.find({});
    return res.json({
      message: "Success",
      posts,
    });
  } catch (e) {
    console.log(e);
  }
});

postRouter.get("/:postId/users_who_liked", async (req, res, next) => {
  try {
    const usernames = await Post.findById(
      { _id: req.params.postId },
      { usernamesWhoLiked: 1 }
    ).lean();

    return res.json({
      ...usernames
    })

  } catch (e) {
    console.log(e);
  }
});

postRouter.post("/", upload, async (req, res, next) => {
  try {
    const file = req.file;
    const downloadURL = await ImageUpload(file, req.body.username, "post");
    let newPost = new Post({
      username: req.body.username,
      caption: req.body.caption,
      postURL: downloadURL,
      avatarURL: req.body.avatarURL,
    });
    await newPost.save();

    await UserTrivia.findOneAndUpdate({
      username: req.body.username,
      $push: { posts: newPost._id },
    });

    return res.status(201).send({
      message: "Added post",
    });
  } catch (e) {
    console.log(e);
  }
});

postRouter.post("/:postId/comments", async (req, res, next) => {
  try {
    await Post.findByIdAndUpdate(
      { _id: req.params.postId },
      {
        $push: {
          comments: {
            username: req.body.username,
            comment: req.body.comment,
            avatarURL: req.body.avatarURL,
          },
        },
      }
    );
    const comments = await getPostComments(req.params.postId);

    return res.status(201).json({
      ...comments,
    });
  } catch (e) {
    console.log(e);
  }
});

postRouter.get("/:postId/comments", async (req, res, next) => {
  try {
    const comments = await getPostComments(req.params.postId);
    return res.status(200).json({
      ...comments,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

postRouter.delete("/:postId/comments/:commentId", async (req, res, next) => {
  try {
    await Post.findByIdAndUpdate(
      { _id: req.params.postId },
      {
        $pull: { comments: { _id: req.params.commentId } },
      },
      { new: true }
    );

    const comments = await getPostComments(req.params.postId);

    return res.json({
      ...comments,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

postRouter.put("/:postId", async (req, res, next) => {
  const postId = req.params.postId;
  const isPostLiked = await Post.findOne({
    _id: postId,
    usernamesWhoLiked: req.body.username,
  });

  if (isPostLiked) {
    await Post.findOneAndUpdate(
      { _id: postId },
      { $pull: { usernamesWhoLiked: req.body.username } }
    );

    await Post.findOneAndUpdate({ _id: postId }, { $inc: { likes: -1 } });

    await UserTrivia.findOneAndUpdate(
      { username: req.body.username },
      { $pull: { likedPosts: postId } }
    );

    const likedPosts = await UserTrivia.findOne(
      { username: req.body.username },
      { likedPosts: 1 }
    ).lean();

    return res.json({
      message: "Post unliked",
      ...likedPosts,
    });
  } else {
    await Post.findOneAndUpdate(
      { _id: postId },
      { $push: { usernamesWhoLiked: req.body.username } }
    );

    await Post.findOneAndUpdate({ _id: postId }, { $inc: { likes: 1 } });

    await UserTrivia.findOneAndUpdate(
      { username: req.body.username },
      { $push: { likedPosts: postId } }
    );

    const likedPosts = await UserTrivia.findOne(
      { username: req.body.username },
      { likedPosts: 1 }
    ).lean();

    return res.json({
      message: "Post liked",
      ...likedPosts,
    });
  }

  // if (savedEvent) {
  //   await UserTrivia.updateOne(
  //     { username: req.body.username },
  //     {
  //       $pull: {
  //         bookedmarkedEvents: eventId,
  //       },
  //     }
  //   );

  //   const bookmarkedEvents = await UserTrivia.findOne(
  //     { username: req.body.username },
  //     "bookedmarkedEvents"
  //   ).lean();

  //   return res.status(409).json({
  //     error: "Removed from Bookmarks!",
  //     ...bookmarkedEvents,
  //   });
  // }

  // await UserTrivia.findOneAndUpdate(
  //   { username: req.body.username },
  //   { $push: { bookedmarkedEvents: eventId } }
  // );

  // const bookmarkedEvents = await UserTrivia.findOne(
  //   { username: req.body.username },
  //   "bookedmarkedEvents"
  // ).lean();

  // return res.status(201).json({
  //   message: "Event successfully added to bookmarks!",

  //   ...bookmarkedEvents,
  // });
});

module.exports = postRouter;
