const mongoose = require("mongoose");
const userTrivia = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      default: "Prefer not to say",
      require: false,
    },

    bio: {
      type: String,
      required: false,
      default: "",
    },

    followers: {
      type: [String],
    },

    followersCount: {
      type: Number,
      default: 0,
    },

    following: {
      type: [String],
    },

    followingCount: {
      type: Number,
      default: 0,
    },

    bookedmarkedEvents: {
      type: [String],
    },

    avatarURL: {
      type: String,
      default:
        "https://t0.gstatic.com/images?q=tbn:ANd9GcSLjgzNXwdx8i6MpWP3v34obkH6E8_MECNh6J8jjvQ45m55Az63",
    },

    savedPosts: {
      type: [mongoose.Schema.Types.ObjectId],
    },
    likedPosts: [mongoose.Schema.Types.ObjectId],
    notifications: [
      {
        username: {
          type: String,
        },
        item: {
          type: String,
        },
        avatarURL: {
          type: String,
        },
        read: {
          type: Boolean,
          default: false,
        },
      },
    ],
    posts: [mongoose.Schema.Types.ObjectId],
  },
  { timestamps: true }
);

const UserTrivia = mongoose.model("UserTrivia", userTrivia);
module.exports = UserTrivia;
