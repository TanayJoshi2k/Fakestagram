const UserTrivia = require("../Models/UserTrivia");

async function updateUserNotifications(
  postAuthor,
  loggedInUser,
  item,
  avatarURL
) {
  await UserTrivia.findOneAndUpdate(
    { username: postAuthor },
    {
      $push: {
        notifications: {
          item: item,
          avatarURL: avatarURL,
          username: loggedInUser,
        },
      },
    },
    { new: true }
  );
}

async function addNotificationToTray(postAuthor, loggedInUser, comment, type) {
  if (postAuthor !== loggedInUser) {
    const result = await UserTrivia.findOne(
      { username: loggedInUser },
      {
        avatarURL: 1,
        _id: 0,
      }
    ).lean();
    switch (type) {
      case "comment":
        await updateUserNotifications(
          postAuthor,
          loggedInUser,
          `commented ${comment} on your post`,
          result.avatarURL
        );
        break;

      case "like":
        await updateUserNotifications(
          postAuthor,
          loggedInUser,
          "liked your post",
          result.avatarURL
        );
        break;

      case "follow":
        await updateUserNotifications(
          postAuthor,
          loggedInUser,
          "started following you",
          result.avatarURL
        );
        break;

      default:
        break;
    }
  }
}

async function getNotifications(username) {
  let notifications = await UserTrivia.find(
    { username: username },
    { notifications: 1 }
  ).lean();

  let result = [];
  for (let i of notifications) {
    result.push(i);
  }
  return result;
}

function initializeSocket(server) {
  const usersConnected = {};
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    const user = { socket: socket };

    socket.on("data", (userDetails) => {
      user.username = userDetails.username;
      usersConnected[userDetails.username] = user;
    });

    socket.on("addComment", async (commentData) => {
      await addNotificationToTray(
        commentData.author,
        commentData.username,
        commentData.comment,
        "comment"
      );

      let notifications = await getNotifications(commentData.author);
      const targetUser = Object.values(usersConnected).find(
        (user) => user.username === commentData.author
      );
      targetUser.socket.emit("updateNotificationTray", ...notifications);
    });

    socket.on("getNotifications", async (data) => {
      let notifications = await getNotifications(data.username);
      const targetUser = Object.values(usersConnected).find(
        (user) => user.username === data.username
      );
      targetUser.socket.emit("updateNotificationTray", ...notifications);
    });

    socket.on("likePost", async (data) => {
      await addNotificationToTray(
        data.postAuthor,
        data.loggedInUser,
        null,
        "like"
      );
      let notifications = await getNotifications(data.postAuthor);
      const targetUser = Object.values(usersConnected).find(
        (user) => user.username === data.postAuthor
      );
      console.log("notifications", notifications);

      targetUser.socket.emit("updateNotificationTray", ...notifications);
    });

    socket.on("follow", async (data) => {
      await addNotificationToTray(
        data.postAuthor,
        data.loggedInUser,
        null,
        "follow"
      );
      let notifications = await getNotifications(data.postAuthor);
      const targetUser = Object.values(usersConnected).find(
        (user) => user.username === data.postAuthor
      );
      targetUser.socket.emit("updateNotificationTray", ...notifications);
    });

    socket.on("disconnect", () => {
      delete usersConnected[user.username];
    });
  });
}

module.exports = initializeSocket;
