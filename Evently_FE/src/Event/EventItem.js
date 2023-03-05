import React, { useState } from "react";
import classes from "./Event.module.css";
import BookmarkIcon from "../Logos/BookmarkIcon";
import Toast from "../Toast/Toast";
import EventActionSpinner from "../Spinner/EventActionSpinner";
import axios from "axios";

function EventItem(props) {
  const [showToast, setShowToast] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState({
    text: "",
    error: false,
  });
  const addToBookmarks = (eventId) => {
    axios
      .post(`events/addToBookmarks/${eventId}`, {
        username: props.username,
      })
      .then((res) => {
        setShowToast(true);
        setToastMessage({ text: res.data.message, error: false });
        setTimeout(() => {
          setShowToast(false);
        }, 2000);
        props.setBookmarkedEvent(res.data.bookedmarkedEvents);
      })
      .catch((e) => {
        setToastMessage({ text: e.response.data.error, error: true });
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 2000);
        props.setBookmarkedEvent(e.response.data.bookedmarkedEvents);
      });
  };

  const attendEvent = (event) => {
    let eventId = event.target.id;
    setShowLoading(true);
    axios
      .post(`/events/attendEvent/${eventId}`, { username: props.username })
      .then((res) => {
        props.setEventsAttending(res.data.eventsAttending);
        setShowLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const unattendEvent = (event) => {
    let eventId = event.target.id;
    setShowLoading(true);
    axios
      .post(`/events/unattendEvent/${eventId}`, { username: props.username })
      .then((res) => {
        props.setEventsAttending(res.data.eventsAttending);
        setShowLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  let eventActionBtn = (
    <button
      id={props.eventData._id}
      onClick={attendEvent}
      className={classes.attendEventBtn}
    >
      +
    </button>
  );

  if (props && props.isAttending) {
    if (props.isAttending) {
      eventActionBtn = (
        <button
          id={props.eventData._id}
          onClick={unattendEvent}
          className={classes.unattendEventBtn}
        >
          🗑
        </button>
      );
    }
  }

  return (
    <div className={classes.event}>
      {showToast ? (
        <Toast
          style={
            toastMessage.error
              ? {
                  backgroundColor: "pink",
                  color: "red",
                  border: "2px solid red",
                }
              : null
          }
        >
          {toastMessage.text}
        </Toast>
      ) : null}

      <h3>{props.eventData.title}</h3>

      <div
        className={
          props.isBookMarked ? classes.bookmarkIconSaved : classes.bookmarkIcon
        }
        onClick={() => addToBookmarks(props.eventData._id)}
      >
        <BookmarkIcon />
      </div>

      <div className={classes.eventDetails}>
        <p>{props.eventData.location}</p>
        <p>{props.eventData?.time}</p>
        <p className={classes.description}>{props.eventData.description}</p>
      </div>

      <div className={classes.btnGrp}>
        <button
          id={props.eventData._id}
          onClick={props.getEvent}
          className={classes.detailsBtn}
        >
          More Details
        </button>
        {showLoading ? <EventActionSpinner /> : eventActionBtn}
      </div>
    </div>
  );
}

export default EventItem;
