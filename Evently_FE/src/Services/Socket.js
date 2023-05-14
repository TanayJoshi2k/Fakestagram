import io from "socket.io-client";
const ENDPOINT = "http://192.168.29.112:4000";
var socket;

export function socketConnection() {
  socket = io(ENDPOINT);
  return socket;
}

export function emitClientData(loggedInUser) {
  socket.emit("data", {
    username: loggedInUser,
  });
}

export function getNotifications(loggedInUser, callback) {
  socket.emit("getNotifications", { username: loggedInUser });
  socket.on("updateNotificationTray", (data) => {
    callback(data);
  });
}

export function emitAddComment(comment, loggedInUser, eventAuthor) {
  socket.emit("addComment", {
    comment: comment,
    loggedInUser: loggedInUser,
    postAuthor: eventAuthor,
  });
}

export function emitLikePost(postAuthor, loggedInUser) {
  socket.emit("likePost", {
    postAuthor: postAuthor,
    loggedInUser: loggedInUser
  });

}

export function emitFollowNotification(postAuthor, loggedInUser) {
  socket.emit("follow", {
    postAuthor: postAuthor,
    loggedInUser: loggedInUser,
  });
}

export function getLastNotification(callback) {
  socket.on("getLastNotification", (data) => {
    callback(data);
  });
}
