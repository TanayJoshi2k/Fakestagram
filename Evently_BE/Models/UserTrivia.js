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
      default:""
    },

    followers: {
      type: [String],
    },

    followersCount: {
      type: Number,
      default: 0
    },

    following: {
      type: [String],
    },

    followingCount: {
      type: Number,
      default: 0
    },

    bookedmarkedEvents: {
      type: [String],
    },

    avatarURL: {
      type: String
    },

    eventsAttending: {
      type: [String],
    },

  },
  { timestamps: true }
);

const UserTrivia = mongoose.model("UserTrivia", userTrivia);

module.exports = UserTrivia;
