const express = require("express");
const UserTrivia = require("../Models/UserTrivia");
const notificationRouter = express.Router();

notificationRouter.put(
  "/notifications/:notificationId",
  async (req, res, next) => {
    try {
      await UserTrivia.findOneAndUpdate(
        { notifications: { $elemMatch: { _id: req.params.notificationId } } },
        {
          $set: {
            "notifications.$.read": true,
          },
        },
        { new: true, safe: true, upsert: true }
      );
    } catch (e) {
      console.log(e);
    }
  }
);

module.exports = notificationRouter;
