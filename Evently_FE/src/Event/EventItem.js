import React, { useEffect, useState } from "react";
import classes from "./Event.module.css";
import BookmarkIcon from "../Logos/BookmarkIcon";
import Toast from "../Toast/Toast";
import Comment from "../Comment/Comment";
import EventActionSpinner from "../Spinner/EventActionSpinner";
import EventParticipationButton from "./EventParticipationButton";
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

  const eventParticipationHandler = (event, action) => {
    let eventId = event.target.id;
    setShowLoading(true);
    axios
      .post(`/events/${action}/${eventId}`, { username: props.username })
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

  const deleteCommentHandler = (eventId, commentId) => {
    axios.delete(`/events/${eventId}/comments/${commentId}`).then((res) => {
      setEventComments([...res.data.comments]);
    });
  };

  let eventActionBtn = (
    <EventParticipationButton
      eventId={props.eventData._id}
      eventParticipationHandler={eventParticipationHandler}
      action={"attendEvent"}
    >
      +
    </EventParticipationButton>
  );

  if (props && props.isAttending) {
    if (props.isAttending) {
      eventActionBtn = (
        <EventParticipationButton
          eventId={props.eventData._id}
          eventParticipationHandler={eventParticipationHandler}
          action={"unattendEvent"}
        >
          🗑
        </EventParticipationButton>
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

<div style={{display:"flex", alignItems:"center"}}>
<Link className={classes.eventTitle}>{props.eventData.title}</Link>
      {showLoading ? <EventActionSpinner /> : eventActionBtn}
</div>
     

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
        {/* <button
          id={props.eventData._id}
          onClick={props.getEvent}
          className={classes.detailsBtn}
        >
          Details
        </button> */}
      </div>
      <div>
        <div className={classes.commentSection}>
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
                      <Comment
                        key={comment._id}
                        commentData={comment}
                        signedInUsername={props.username}
                        deleteCommentHandler={() =>
                          deleteCommentHandler(props.eventData._id, comment._id)
                        }
                      />
                    );
                  }
                  return null;
                })}
              </div>
            )
          ) : null}
          <div className={classes.inputCommentContainer}>
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
