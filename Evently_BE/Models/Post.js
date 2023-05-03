const mongoose = require("mongoose");
const post = mongoose.Schema(
  {
    postURL: {
      type: String,
      default: "",
      required: true,
    },
    avatarURL: {
      type: String,
      default: "",
    },
    caption: {
      type: String,
      default: "",
    },
    username: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    usernamesWhoLiked: [
      {
        username: { type: String },
        avatarURL: { type: String },
        name: { type: String },
      },
    ],
    comments: [
      {
        username: String,
        comment: String,
        avatarURL: String,
      },
    ],
    day: {
      type: String,
    },

    date: {
      type: String,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", post);
module.exports = Post;
