const express = require("express");
const notificationRouter = express.Router();
const { markNotificationRead } = require("../Services/db_queries/User_queries");

notificationRouter.put(
  "/notifications/:notificationId",
  async (req, res, next) => {
    try {
      await markNotificationRead(req.params.notificationId);
    } catch (e) {
      console.log(e);
    }
  }
);

module.exports = notificationRouter;