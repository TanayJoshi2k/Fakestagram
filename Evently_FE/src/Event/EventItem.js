import React, { useState } from "react";
import classes from "./Event.module.css";
import BookmarkIcon from "../Logos/BookmarkIcon";
import Toast from "../Toast/Toast";
import axios from "axios";

function EventItem(props) {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const addToBookmarks = (eventId) => {
    axios
      .post(`http://localhost:4000/events/addToBookmarks/:${eventId}`, {
        username: props.username, 
      })
      .then((res) => {
        setShowSuccessToast(true);
        setTimeout(() => {
          setShowSuccessToast(false);
        }, 2000);
      })
      .catch((e) => {
        setShowErrorToast(true);
        setTimeout(() => {
          setShowErrorToast(false);
        }, 2000);
      });
  };

  return (
    <div className={classes.event}>
      {showSuccessToast ? (
        <Toast>Event successfully added to bookmarks!</Toast>
      ) : null}
      {showErrorToast ? (
        <Toast
          style={{
            backgroundColor: "pink",
            color: "red",
            border: "2px solid red",
          }}
        >
          Event already added to bookmarks!
        </Toast>
      ) : null}

      <h3>{props.eventData.title}</h3>
      <div
        className={classes.bookmarkIcon}
        onClick={() => addToBookmarks(props.eventData._id)}
      >
        <BookmarkIcon />
      </div>

      <div className={classes.eventDetails}>
        <p>{props.eventData.location}</p>
        <p>{props.eventData?.time}</p>
        <p className={classes.description}>{props.eventData.description}</p>
      </div>

      <button
        id={props.eventData._id}
        onClick={props.getEvent}
        className={classes.detailsBtn}
      >
        More Details
      </button>
    </div>
  );
}

export default EventItem;
