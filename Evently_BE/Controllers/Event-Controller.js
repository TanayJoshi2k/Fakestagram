const express = require("express");
const Events = require("../Models/Events");
const UserTrivia = require("../Models/UserTrivia");
const mongoose = require("mongoose");
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

  return res.status(200).json({
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
    return res.status(409).json({
      error: "Event already added to bookmarks!",
    });
  }

  await UserTrivia.findOneAndUpdate(
    { username: req.body.username },
    { $push: { bookedmarkedEvents: eventId } }
  );

  return res.status(200).json({ message: "Saved to bookmarks" });
});

eventRouter.get("/saved", async (req, res, next) => {
  const bookedmarkedEvents = await UserTrivia.find({
    username: req.session.username,
  }).select("bookedmarkedEvents");

  return res.json({
    bookedmarkedEvents,
  });
});

module.exports = eventRouter;
