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
    },

    followers: {
      type: [String],
    },

    followersCount: {
      type: Number,
    },

    following: {
      type: [String],
    },

    followingCount: {
      type: Number,
    },

    bookedmarkedEvents: {
      type: [String],
    },

    confirmedDetails: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const UserTrivia = mongoose.model("UserTrivia", userTrivia);

module.exports = UserTrivia;
