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
  if (postAuthor !== loggedInUser.username) {
    
    switch (type) {
      case "comment":
        await updateUserNotifications(
          postAuthor,
          loggedInUser.username,
          `commented ${comment} on your post`,
          loggedInUser.avatarURL
        );
        break;

      case "like":
        await updateUserNotifications(
          postAuthor,
          loggedInUser.username,
          "liked your post",
          loggedInUser.avatarURL
        );
        break;

      case "follow":
        await updateUserNotifications(
          postAuthor,
          loggedInUser.username,
          "started following you",
          loggedInUser.avatarURL
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

function getTargetUser(usersConnected, destinationUser) {
  const targetUser = Object.values(usersConnected).find(
    (user) => user.username === destinationUser
  );
  return targetUser;
}

function sendNotification(targetUserSocket, data, item) {
  let notification = {
    postAuthor: data.postAuthor,
    username: data.loggedInUser.username,
    item: item,
    avatarURL: data.loggedInUser.avatarURL,
  };

  targetUserSocket.socket.emit("getLastNotification", notification);
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

    socket.on("addComment", async (data) => {
      await addNotificationToTray(
        data.postAuthor,
        data.loggedInUser,
        data.comment,
        "comment"
      );

      const targetUser = getTargetUser(usersConnected, data.postAuthor);
      if (targetUser && data.postAuthor !== data.loggedInUser.username) {
        sendNotification(
          targetUser,
          data,
          `commented ${data.comment} on your post`
        );
      }
    });

    socket.on("getNotifications", async (data) => {
      let notifications = await getNotifications(data.username);
      const targetUser = getTargetUser(usersConnected, data.username);
      if (targetUser) {
        targetUser.socket.emit("updateNotificationTray", ...notifications);
      }
    });

    socket.on("likePost", async (data) => {
      await addNotificationToTray(
        data.postAuthor,
        data.loggedInUser,
        null,
        "like"
      );
      const targetUser = getTargetUser(usersConnected, data.postAuthor);
      if (targetUser && data.postAuthor !== data.loggedInUser.username) {
        sendNotification(targetUser, data, "liked your post");
      }
    });

    socket.on("follow", async (data) => {
      await addNotificationToTray(
        data.postAuthor,
        data.loggedInUser,
        null,
        "follow"
      );
      const targetUser = getTargetUser(usersConnected, data.postAuthor);
      if (targetUser && data.postAuthor !== data.loggedInUser.username) {
        sendNotification(targetUser, data, "started following you");
      }
    });

    socket.on("disconnect", () => {
      delete usersConnected[user.username];
    });
  });
}

module.exports = initializeSocket;
