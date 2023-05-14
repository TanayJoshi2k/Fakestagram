import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setBookmarkedEvents, setEventsAttending } from "../redux/actions/eventActions";
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
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
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
    await getPostComments(
      eventId,
      setLoadingComments,
      eventComments,
      setEventComments
    );
  };

  useEffect(() => {
    getPostCommentsHandler(props.eventData._id);
  }, []);

  const addEventToBookmarksHandler = async () => {
    const eventId = props.eventData._id;
    try {
      const res = await axios.post(`events/addToBookmarks/${eventId}`, {
        username: state.userReducer.username,
      });
      dispatch(setBookmarkedEvents(res.data.bookedmarkedEvents));
      setToastMessage({ text: res.data.message, error: false });
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    } catch (e) {
      dispatch(setBookmarkedEvents(e.response.data.bookedmarkedEvents));
      setToastMessage({ text: e.response.data.error, error: true });
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    }
  };

  const eventParticipationHandler = async (event, action) => {
    let eventId = event.target.id;

    try {
      setShowLoading(true);
      const res = await axios.post(`/events/${action}/${eventId}`, {
        username: state.userReducer.username,
      });

      dispatch(setEventsAttending(res.data.eventsAttending));
      setShowLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const addCommentHandler = (event) => {
    const eventId = event.target.id;
    
    emitAddComment(
      eventId,
      comment,
      props.eventData.createdBy,
      loggedInUser
    );
    addComment(
      eventId,
      state.userReducer,
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
                {eventComments?.map((comment) => {
                  if (comment) {
                    return (
                      <Comment
                        key={comment._id}
                        commentData={comment}
                        signedInUsername={state.userReducer.username}
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
