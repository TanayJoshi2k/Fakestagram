const express = require("express");
require("dotenv").config();
const cors = require("cors");
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const postRouter = require("./Controllers/Post-Controller");
const authRouter = require("./Controllers/Auth-controller");
const accountPageRouter = require("./Controllers/Account-Page-Controller");
const searchRouter = require("./Controllers/Search-Controller");
const notificationRouter = require("./Controllers/Notifications-Controller");
const MONGODB_URI = process.env.MONGODB_URI;
const initializeSocket = require("./Services/Notification-Service");

const app = express();
const store = new mongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

function errorHandler(err, req, res, next) {
  const statusCode = err?.status || 500;
  const message = err?.message || "Internal Server Error";
  return res.status(statusCode).json({
    error: message,
  });
}

app.use(authRouter);
app.use("/posts", postRouter);
app.use("/account", accountPageRouter);
app.use(searchRouter);
app.use(notificationRouter);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    const server = app.listen(process.env.PORT, () =>
      console.log("Example app listening on port 4000!")
    );

    initializeSocket(server);
  });

app.use(errorHandler);
