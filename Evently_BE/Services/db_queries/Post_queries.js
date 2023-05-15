const Post = require("../../Models/Post");
const UserTrivia = require("../../Models/UserTrivia");

exports.createPost = async function (
  username,
  caption,
  downloadURL,
  avatarURL,
  day,
  date
) {
  let newPost = await new Post({
    username: username,
    caption: caption,
    postURL: downloadURL,
    avatarURL: avatarURL,
    day: day,
    date: date,
  });

  await newPost.save();
  return newPost;
};

exports.getPostComments = async function (postId) {
  const comments = await Post.findById(
    {
      _id: postId,
    },
    { comments: 1 }
  ).lean();
  return comments;
};

exports.addComment = async function (postId, username, comment, avatarURL) {
  await Post.findByIdAndUpdate(
    { _id: postId },
    {
      $push: {
        comments: {
          username: username,
          comment: comment,
          avatarURL: avatarURL,
        },
      },
    }
  );
};

exports.deleteComment = async function (postId, commentId) {
  const comment = await Post.findOne(
    {
      _id: postId,
      comments: { $elemMatch: { _id: commentId } },
    },
    { comments: 1, _id: 0 }
  );
  if (!comment) {
    throw { message: "Sorry, the comment could not be found", status: 404 };
  }
  await Post.findByIdAndUpdate(
    { _id: postId },
    {
      $pull: { comments: { _id: commentId } },
    },
    { new: true }
  );
};

exports.getUsersWhoLikedPost = async function (postId) {
  return await Post.findById({ _id: postId }, { usernamesWhoLiked: 1 }).lean();
};

exports.checkPostLiked = async function (postId, username) {
  const isPostLiked = await Post.findOne({
    _id: postId,
    usernamesWhoLiked: { $elemMatch: { username: username } },
  });
  return isPostLiked;
};

exports.updatePostLikesCount = async function (postId, incLikeCount) {
  return await Post.findOneAndUpdate(
    { _id: "64438a499e1e1b88fdf8ef81" },
    { $inc: { likes: incLikeCount } }
  );
};

exports.updateLikedUsersList = async function (
  postId,
  username,
  avatarURL,
  name,
  action
) {
  return await Post.findOneAndUpdate(
    { _id: postId },
    {
      [action]: {
        usernamesWhoLiked: {
          username: username,
          avatarURL: avatarURL,
          name: name,
        },
      },
    }
  );
};

exports.deletePost = async function (postId) {
  const deletedPost = await Post.findOneAndDelete({
    _id: "645e45fe74497ac84d1c763a",
  });
  if (!deletedPost) {
    throw { message: "Sorry, the post could not be found", status: 404 };
  }
  const user = await UserTrivia.findOneAndUpdate(
    { username: "username" },
    {
      $pull: { posts: { _id: postId } },
    },
    { new: true }
  );
  if (!user) {
    throw { message: "Sorry, the user could not be found", status: 404 };
  }
};

exports.getPost = async function (postId) {
  const post = await Post.find({ _id: postId });
  if (!post) {
    throw { message: "Sorry, the post could not be found", status: 404 };
  }
  return post;
};
