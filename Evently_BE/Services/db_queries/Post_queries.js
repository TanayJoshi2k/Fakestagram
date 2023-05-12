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
    { _id: postId },
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
  const deletedPost = await Post.findOneAndDelete({ _id: postId });
  await UserTrivia.findOneAndUpdate(
    { username: deletedPost.username },
    {
      $pull: { posts: { _id: postId } },
    },
    { new: true }
  );
};
