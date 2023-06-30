const express = require("express");
const Post = require("../Models/Post");
const postRouter = express.Router();
require("../Models/db");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("post");

const ImageUpload = require("../Services/Image-Upload-Service");
const {
  getPostComments,
  addComment,
  deleteComment,
  checkPostLiked,
  updatePostLikesCount,
  updateLikedUsersList,
  createPost,
  deletePost,
  getUsersWhoLikedPost,
  getPost,
} = require("../Services/db_queries/Post_queries");

const {
  updateLikedPostsList,
  getLikedPosts,
  updateUserPostsList,
  updateSavedPostsList,
  getSavedPosts,
  checkPostSaved,
} = require("../Services/db_queries/User_queries");

global.XMLHttpRequest = require("xhr2");

postRouter.get("/", async (req, res, next) => {
  try {
    const posts = await Post.find({});
    return res.json({
      message: "Success",
      posts,
    });
  } catch (e) {
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

postRouter.get("/:postId/users_who_liked", async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const usernames = await getUsersWhoLikedPost(postId);

    return res.json({
      ...usernames,
    });
  } catch (e) {
    next(e)
  }
});

postRouter.post("/", upload, async (req, res, next) => {
  try {
    const file = req.file;
    const { username, caption, avatarURL } = req.body;
    const downloadURL = await ImageUpload(file, username, "post");

    const timePosted = Date().split(" ");
    const day = timePosted[1];
    const date = timePosted[2];

    let newPost = await createPost(
      username,
      caption,
      downloadURL,
      avatarURL,
      day,
      date
    );
    //push the new post's id in the user's postId list
    await updateUserPostsList(newPost._id, username);
    const posts = await Post.find({});

    return res.status(201).send({
      message: "Added post",
      posts,
    });
  } catch (e) {
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

postRouter.post("/:postId/comments", async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const { username, comment, avatarURL } = req.body;
    await addComment(postId, username, comment, avatarURL);
    const comments = await getPostComments(postId);
    return res.status(201).json({ ...comments });
  } catch (e) {
    next(e);
  }
});

postRouter.get("/:postId/comments", async (req, res, next) => {
  try {
    const comments = await getPostComments(req.params.postId);
    return res.status(200).json({
      ...comments,
    });
  } catch (e) {
    next(e);
  }
});

postRouter.delete("/:postId/comments/:commentId", async (req, res, next) => {
  try {
    const { postId, commentId } = req.params;

    await deleteComment(postId, commentId);
    const comments = await getPostComments(postId);

    return res.json({
      ...comments,
    });
  } catch (e) {
    next(e);
  }
});

postRouter.put("/:postId", async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const { username, avatarURL, name } = req.body;
    const isPostLiked = await checkPostLiked(postId, username);
    let incLikeCount;
    if (isPostLiked) {
      // If the post is already liked, unlike the post i.e inc likes by -1,
      // remove the user from the list of users who liked the post
      // and finally remove the post from the list of posts liked by user
      incLikeCount = -1;
      await updatePostLikesCount(postId, incLikeCount);
      await updateLikedUsersList(postId, username, avatarURL, name, "$pull");
      await updateLikedPostsList(postId, username, "$pull");
    } else {
      incLikeCount = 1;
      await updatePostLikesCount(postId, incLikeCount);
      await updateLikedUsersList(postId, username, avatarURL, name, "$push");
      await updateLikedPostsList(postId, username, "$push");
    }
    const likedPosts = await getLikedPosts(username);
    const usernamesWhoLiked = await getUsersWhoLikedPost(postId);

    return res.json({
      ...likedPosts,
      ...usernamesWhoLiked,
    });
  } catch (e) {
    next(e);
  }
});

postRouter.put("/savepost/:postId", async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const { username } = req.body;
    let message;

    const isPostSaved = await checkPostSaved(postId, username);

    if (isPostSaved) {
      // If the post is already saved, remove the post from saved posts list
      message = "Post unsaved";
      await updateSavedPostsList(postId, username, "$pull");
    } else {
      message = "Post saved";
      await updateSavedPostsList(postId, username, "$push");
    }

    let savedPosts = await getSavedPosts(username);

    return res.json({
      message: message,
      ...savedPosts,
    });
  } catch (e) {
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

postRouter.delete("/:postId", async (req, res, next) => {
  const { postId } = req.params;
  try {
    await deletePost(postId, req.session.username);
    const posts = await Post.find({});
    return res.status(202).json({
      message: "deleted",
      posts,
    });
  } catch (e) {
    next(e);
  }
});

postRouter.get("/:postId", async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await getPost(postId);
    return res.status(200).json(...post);
  } catch (e) {
    next(e);
  }
});

module.exports = postRouter;
