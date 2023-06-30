const UserTrivia = require("../../Models/UserTrivia");

exports.getLikedPosts = async function (username) {
  let likedPosts = await UserTrivia.findOne(
    { username: username },
    { likedPosts: 1 }
  ).lean();
  if (!likedPosts) {
    throw { message: "Sorry, the user could not be found", status: 404 };
  }
  return likedPosts;
};

exports.updateLikedPostsList = async function (postId, username, action) {
  await UserTrivia.findOneAndUpdate(
    { username: username },
    { [action]: { likedPosts: postId } }
  );
};

exports.updateUserPostsList = async function (newPostId, username) {
  return await UserTrivia.findOneAndUpdate(
    { username: username },
    { $push: { posts: newPostId } }
  );
};

exports.markNotificationRead = async function (notificationId) {
  await UserTrivia.findOneAndUpdate(
    { notifications: { $elemMatch: { _id: notificationId } } },
    {
      $set: {
        "notifications.$.read": true,
      },
    },
    { new: true, safe: true, upsert: true }
  );
};

exports.searchUsers = async function (keyword) {
  return await UserTrivia.find(
    {
      username: { $regex: "^" + keyword, $options: "i" },
    },
    { username: 1, avatarURL: 1 }
  ).lean();
};

exports.getSavedPosts = async function (username) {
  return await UserTrivia.findOne(
    { username: username },
    { savedPosts: 1 }
  ).lean();
};

exports.checkPostSaved = async function (postId, username) {
  return await UserTrivia.findOne({
    username: username,
    savedPosts: postId,
  });
};

exports.updateSavedPostsList = async function (postId, username, action) {
  return await UserTrivia.findOneAndUpdate(
    { username: username },
    { [action]: { savedPosts: postId } }
  );
};
