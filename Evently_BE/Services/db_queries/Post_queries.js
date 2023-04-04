const Post = require("../../Models/Post");

exports.createPost = async function (username, caption, postURL, avatarURL) {
  let newPost = new Post({
    username: username,
    caption: caption,
    postURL: downloadURL,
    avatarURL: req.body.avatarURL,
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
  await Post.findById({ _id: postId }, { usernamesWhoLiked: 1 }).lean();
};

exports.checkPostLiked = async function (postId, username) {
  const isPostLiked = await Post.findOne({
    _id: postId,
    usernamesWhoLiked: username,
  });
  return isPostLiked;
};

exports.updatePostLikesCount = async function (postId, incLikeCount) {
  return await Post.findOneAndUpdate(
    { _id: postId },
    { $inc: { likes: incLikeCount } }
  );
};

exports.updateLikedUsersList = async function (postId, username, action) {
  return await Post.findOneAndUpdate(
    { _id: postId },
    { [action]: { usernamesWhoLiked: username } }
  );
};
