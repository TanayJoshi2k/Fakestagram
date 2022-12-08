const mongoose = require("mongoose");
const EventsSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    location: {
      type: "String",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Events = mongoose.model("Events", EventsSchema);

module.exports = Events;
