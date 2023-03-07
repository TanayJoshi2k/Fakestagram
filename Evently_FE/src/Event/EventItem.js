import React, { useEffect, useState } from "react";
import classes from "./Event.module.css";
import BookmarkIcon from "../Logos/BookmarkIcon";
import Toast from "../Toast/Toast";
import EventActionSpinner from "../Spinner/EventActionSpinner";
import { Link } from "react-router-dom";
import axios from "axios";
function EventItem(props) {
  const [showToast, setShowToast] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState({
    text: "",
    error: false,
  });
  const [comment, setComment] = useState("");
  const [eventComments, setEventComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const getPostComments = () => {
    setLoadingComments(true);
    axios
      .get(`/events/${props.eventData._id}/comments`)
      .then((res) => {
        setLoadingComments(false);
        setEventComments(...[...eventComments, res.data.comments]);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getPostComments();
  }, []);

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
  const addCommentHandler = (e) => {
    const eventId = e.target.id;
    axios
      .post(`/events/${eventId}/comments`, {
        username: props.username,
        comment: comment,
        avatarURL: props.avatarURL,
      })
      .then((res) => {
        setComment("");
        setEventComments([...res.data.comments]);
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
      <div>
        <div className={classes.inputCommentContainer}>
          {eventComments ? (
            loadingComments ? (
              <EventActionSpinner />
            ) : (
              <div
                className={
                  eventComments.length
                    ? classes.commentsContainer
                    : classes.hideComments
                }
              >
                {eventComments?.map((comment) => {
                  if (comment) {
                    return (
                      <div
                        key={Math.random().toString()}
                        className={classes.comment}
                      >
                        <img src={comment.avatarURL} />
                        <Link
                          className={classes.username}
                          to={`/account/${comment.username}`}
                        >
                          {comment.username}
                        </Link>
                        <span className={classes.commentText}>
                          {comment.comment}
                        </span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )
          ) : null}
          <div>
            <input
              type="text"
              placeholder="Add a comment..."
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
            <button
              id={props.eventData._id}
              disabled={comment.trim() === "" || comment.trim().length === 0}
              onClick={addCommentHandler}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventItem;
