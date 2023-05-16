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
  await Post.findOneAndUpdate(
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

exports.deletePost = async function (postId, username) {
  //Additional check if user is deleting their own post
  const post = await Post.findById(
    { _id: postId },
    { _id: 0, username: 1 }
  ).lean();


  if (username !== post.username) {
    throw {
      message: "Sorry, you are not authorized to delete the post",
      status: 404,
    };
  }

  const deletedPost = await Post.findOneAndDelete({
    _id: postId,
  });

  if (!deletedPost) {
    throw { message: "Sorry, the post could not be found", status: 404 };
  }

  //Pull the postId from the user's list of postIds
  const user = await UserTrivia.findOneAndUpdate(
    { username: deletedPost.username },
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
