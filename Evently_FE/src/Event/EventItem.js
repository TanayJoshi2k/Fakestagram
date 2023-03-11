import React, { useEffect, useState } from "react";
import classes from "./Event.module.css";
import BookmarkIcon from "../Logos/BookmarkIcon";
import Toast from "../Toast/Toast";
import Comment from "../Comment/Comment";
import EventActionSpinner from "../Spinner/EventActionSpinner";
import EventParticipationButton from "./EventParticipationButton";
import { Link } from "react-router-dom";
import axios from "axios";
import { emitAddComment } from "../Services/Socket";
import {
  getPostComments,
  addEventToBookmarks,
  addComment,
  eventParticipation,
} from "../Services/EventHelpers";

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

  const getPostCommentsHandler = async (eventId) => {
    setLoadingComments(true);
    const comments = await getPostComments(eventId);
    setLoadingComments(false);
    setEventComments(...[...eventComments, comments]);
  };

  useEffect(() => {
    getPostCommentsHandler(props.eventData._id);
  }, []);

  const addEventToBookmarksHandler = () => {
    addEventToBookmarks(
      props.eventData._id,
      props.userDetails.username,
      setShowToast,
      setToastMessage,
      props.setBookmarkedEvent
    );
  };

  const eventParticipationHandler = (event, action) => {
    let eventId = event.target.id;
    eventParticipation(
      eventId,
      action,
      props.userDetails,
      props.setEventsAttending,
      setShowLoading
    );
  };

  const addCommentHandler = (e) => {
    const eventId = e.target.id;
    emitAddComment(
      eventId,
      comment,
      props.userDetails.username,
      props.eventData.createdBy
    );
    addComment(
      eventId,
      props.userDetails,
      comment,
      setEventComments,
      setComment
    );
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
      action={props.isAttending ? "unattendEvent" : "attendEvent"}
    >
      {props.isAttending ? "🗑" : "+"}
    </EventParticipationButton>
  );

  return (
    <div className={classes.event}>
      <div
        className={
          props.isBookMarked ? classes.bookmarkIconSaved : classes.bookmarkIcon
        }
        onClick={() => addEventToBookmarksHandler()}
      >
        <BookmarkIcon />
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <Link className={classes.eventTitle}>{props.eventData.title}</Link>
        {showLoading ? <EventActionSpinner /> : eventActionBtn}
      </div>

      <div className={classes.eventDetails}>
        <p>{props.eventData.location}</p>
        <p>{props.eventData?.time}</p>
        <p className={classes.description}>{props.eventData.description}</p>
      </div>

      <div className={classes.btnGrp}></div>
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
                {eventComments.map((comment) => {
                  if (comment) {
                    return (
                      <Comment
                        key={comment._id}
                        commentData={comment}
                        signedInUsername={props.userDetails.username}
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
        {showToast ? (
          <Toast isErrorMessage={toastMessage.error}>{toastMessage.text}</Toast>
        ) : null}
      </div>
    </div>
  );
}
export default EventItem;
