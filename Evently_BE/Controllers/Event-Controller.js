const express = require("express");
const Events = require("../Models/Events");

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
      time: req.body.time
    });

    console.log("====here====");
    await newEvent.save();

  return res.status(200).json({
    message: {
        event: newEvent,
      text: "Successfully created Event",
    },
  });
});

module.exports = eventRouter;
