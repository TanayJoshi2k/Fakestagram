const express = require("express");
const Events = require("../Models/Events");
const UserTrivia = require("../Models/UserTrivia");
const mongoose = require("mongoose");
const User = require("../Models/User");
const eventRouter = express.Router();

eventRouter.get("/all", async (req, res, next) => {
  try {
    const events = await Events.find({});
    res.status(200).json({
      message: "Events",
      events,
    });
  } catch (e) {
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

eventRouter.get("/event/:eventId", async (req, res, next) => {
  const eventId = req.params.eventId;
  const event = await Events.findOne({ _id: eventId });
  return res.json({
    message: `Event Data for given for ${req.params.eventId}`,
    event,
  });
});

eventRouter.post("/saveEvent", async (req, res, next) => {
  const eventErrors = {
    titleError: "",
    timeError: "",
    durationError: "",
    locationError: "",
    descriptionError: "",
  };

  const time = req.body.time;
  if (req.body.title.trim() === "") {
    eventErrors.titleError = "Required";
  }
  if (req.body.time === "") {
    eventErrors.timeError = "Required";
  }
  if (req.body.location.trim() === "") {
    eventErrors.locationError = "Required";
  }
  if (req.body.description.trim() === "") {
    eventErrors.descriptionError = "Required";
  }

  const isEmpty = !Object.values(eventErrors).some(
    (x) => x !== null && x !== ""
  );

  if (!isEmpty) {
    //if eventErrors is not empty

    return res.status(400).json({
      error: { ...eventErrors },
    });
  }

  let newEvent = new Events({
    title: req.body.title.trim(),
    location: req.body.location.trim(),
    description: req.body.description.trim(),
    time: req.body.time,
  });

  await newEvent.save();

  return res.status(201).json({
    message: {
      event: newEvent,
      text: "Successfully created Event",
    },
  });
});

eventRouter.post("/addToBookmarks/:eventId", async (req, res, next) => {
  const eventId = req.params.eventId;
  const savedEvent = await UserTrivia.findOne({
    username: req.body.username,
    bookedmarkedEvents: eventId,
  });

  if (savedEvent) {
    await UserTrivia.updateOne(
      { username: req.body.username },
      {
        $pull: {
          bookedmarkedEvents: eventId,
        },
      }
    );

    const bookmarkedEvents = await UserTrivia.findOne(
      { username: req.body.username },
      "bookedmarkedEvents"
    ).lean();

    return res.status(409).json({
      error: "Removed from Bookmarks!",
      ...bookmarkedEvents,
    });
  }

  await UserTrivia.findOneAndUpdate(
    { username: req.body.username },
    { $push: { bookedmarkedEvents: eventId } }
  );

  const bookmarkedEvents = await UserTrivia.findOne(
    { username: req.body.username },
    "bookedmarkedEvents"
  ).lean();

  return res.status(201).json({
    message: "Event successfully added to bookmarks!",

    ...bookmarkedEvents,
  });
});

eventRouter.get("/saved", async (req, res, next) => {
  // get ids of saved events from UserTrivia
  const bookedmarkedEventIds = await UserTrivia.findOne(
    {
      username: req.session.username,
    },
    "bookedmarkedEvents"
  ).lean();

  // for the above ids, get matching documents from events collection

  const bookedmarkedEvents = await Events.find({
    _id: { $in: bookedmarkedEventIds.bookedmarkedEvents },
  }).lean();
  let result = [];
  bookedmarkedEvents.map((event) => result.push(event));

  return res.json({
    result,
  });
});

eventRouter.post("/attendEvent/:eventId", async (req, res, next) => {
  try {
    await UserTrivia.findOneAndUpdate(
      { username: req.body.username },
      { $push: { eventsAttending: req.params.eventId.toString() } }
    );

    const eventsAttending = await UserTrivia.findOne(
      { username: req.body.username },
      "eventsAttending"
    ).lean();

    return res.status(201).json({
      ...eventsAttending,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

eventRouter.post("/unattendEvent/:eventId", async (req, res, next) => {
  try {
    await UserTrivia.updateOne(
      { username: req.body.username },
      {
        $pull: {
          eventsAttending: req.params.eventId.toString(),
        },
      }
    );

    const eventsAttending = await UserTrivia.findOne(
      { username: req.body.username },
      "eventsAttending"
    ).lean();

    return res.status(202).json({
      ...eventsAttending,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});
eventRouter.post("/:eventId/comments", async (req, res, next) => {
  try {
    await Events.findByIdAndUpdate(
      { _id: req.params.eventId },
      {
        $push: {
          comments: {
            username: req.body.username,
            comment: req.body.comment,
            avatarURL: req.body.avatarURL,
          },
        },
      }
    );

    const comments = await Events.findById(
      {
        _id: req.params.eventId,
      },
      "comments"
    ).lean();

    return res.status(201).json({
      ...comments,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

eventRouter.get("/:eventId/comments", async (req, res, next) => {
  try {
    const comments = await Events.findById(
      {
        _id: req.params.eventId,
      },
      "comments"
    ).lean();

    return res.status(200).json({
      ...comments,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});
module.exports = eventRouter;
