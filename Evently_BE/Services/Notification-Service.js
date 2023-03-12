const UserTrivia = require("../Models/UserTrivia");

async function addNotificationToTray(eventAuthor, commenter, comment) {
  if (eventAuthor !== commenter) {
    const result = await UserTrivia.findOne(
      { username: commenter },
      {
        avatarURL: 1,
        _id: 0,
      }
    ).lean();

    await UserTrivia.findOneAndUpdate(
      { username: eventAuthor },
      {
        $push: {
          notifications: {
            item: `${commenter} commented ${comment} on your post`,
            avatarURL: result.avatarURL.toString(),
          },
        },
      },
      { new: true }
    );
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
    console.log("connected", socket.id);
    socket.on("data", (userDetails) => {
      user.username = userDetails.username;
      usersConnected[userDetails.username] = user;
    });

    socket.on("addComment", async (commentData) => {
      await addNotificationToTray(
        commentData.author,
        commentData.username,
        commentData.comment
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

    socket.on("disconnect", () => {
      delete usersConnected[user.username];
    });
  });
}

module.exports = initializeSocket;
