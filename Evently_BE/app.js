const express = require("express");
require("dotenv").config();
const cors = require("cors");
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const eventRouter = require("./Controllers/Event-Controller");
const authRouter = require("./Controllers/Auth-controller");
const accountPageRouter = require("./Controllers/Account-Page-Controller");

const MONGODB_URI = process.env.MONGODB_URI;

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

app.get("/isAuth", (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.status(401).json({
      message: "",
      error: {
        authorized: false,
      },
    });
  }

  return res.status(200).json({
    message: { authorized: true, username: req.session.username },
    error: {},
  });
});

app.use(authRouter);
app.use("/events", eventRouter);
app.use("/account", accountPageRouter);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    app.listen(process.env.PORT, () =>
      console.log("Example app listening on port 4000!")
    );
  });
