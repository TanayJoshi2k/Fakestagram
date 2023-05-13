import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Comment from "../Comment/Comment";
import { Link } from "react-router-dom";
import PostActions from "./PostActions";
import ShowUserLikes from "../DisplayUserLikes/ShowUserLikes";
import { addPostComment, getPostComments } from "../Services/PostService";
import { emitAddComment, emitLikePost } from "../Services/Socket";
import EventActionSpinner from "../Spinner/EventActionSpinner";
import Heart from "../Logos/Heart";
import HeartUnfill from "../Logos/HeartUnfill";
import SavePost from "../Logos/SavePost";
import SavePostUnfill from "../Logos/SavePostUnfill";
import CommentIcon from "../Assets/comment.png";
import EllipsisMenu from "../Assets/ellipsisMenu.png";
import Modal from "../Modal/Modal";
import axios from "axios";
import classes from "./Post.module.css";
import {
  setLikedPosts,
  setSavedPosts,
  viewCurrentPost,
} from "../redux/actions/userActions";
import { motion, AnimatePresence } from "framer-motion";
import FramerHeart from "../Logos/FramerHeart";

function Post(props) {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const [postComments, setPostComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPostActionsModal, setShowPostActionsModal] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);

  const getPostCommentsHandler = async (postId) => {
    await getPostComments(
      postId,
      setLoadingComments,
      postComments,
      setPostComments
    );
  };

  useEffect(() => {
    getPostCommentsHandler(props.postData._id);
  }, []);

  const addCommentHandler = (event) => {
    const postId = event.target.id;
    emitAddComment(
      postId,
      comment,
      state.userReducer.username,
      props.postData.username
    );
    addPostComment(
      postId,
      state.userReducer,
      comment,
      setPostComments,
      setComment
    );
  };

  const deleteCommentHandler = (postId, commentId) => {
    axios.delete(`/posts/${postId}/comments/${commentId}`).then((res) => {
      setPostComments([...res.data.comments]);
    });
  };

  const doubleClickHandler = (e) => {
    if (e.detail === 2) {
      likePostHandler();
    }
  };

  const likePostHandler = () => {
    const postId = props.postData._id;
    if (!props.isLiked) {
      // emitLikePost(props.postData.username, state.userReducer.username);
    }
    axios
      .put(`/posts/${postId}`, {
        username: state.userReducer.username,
        avatarURL: state.userReducer.avatarURL,
        name: state.userReducer.firstName + " " + state.userReducer.lastName,
      })
      .then((res) => {
        dispatch(setLikedPosts(res.data.likedPosts));
        dispatch(
          setPostDetails({
            postId: postId,
            likes: res.data.likes,
            usernamesWhoLiked: res.data.usernamesWhoLiked,
          })
        );
      })
      .catch((e) => console.log(e));
  };

  const savePostHandler = async () => {
    const postId = props.postData._id;
    axios
      .put(`/posts/savepost/${postId}`, {
        username: state.userReducer.username,
      })
      .then((res) => {
        dispatch(setSavedPosts(res.data.savedPosts));
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <>
      <AnimatePresence>
        {showModal && (
          <Modal
            key="likesModal"
            closeModal={() => setShowModal(false)}
            title="Likes"
          >
            <ShowUserLikes users={props.postData.usernamesWhoLiked} />
          </Modal>
        )}

        {showPostActionsModal && (
          <Modal key="modal" closeModal={() => setShowPostActionsModal(false)}>
            <PostActions
              postId={props.postData._id}
              users={props.postData.usernamesWhoLiked}
              postData={props.postData}
              loggedInUser={state.userReducer.username}
            />
          </Modal>
        )}
      </AnimatePresence>

      <div key={props.postData._id} className={classes.post}>
        <div className={classes.postAuthorInfo}>
          <img src={props.postData.avatarURL} className={classes.avatarURL} />
          <Link to={`/account/${props.postData.username}`}>
            {props.postData.username}
          </Link>
          <div className={classes.moreActions}>
            <img
              src={EllipsisMenu}
              alt="..."
              onClick={() => {
                setShowPostActionsModal(true);
                dispatch(viewCurrentPost(props.postData));
              }}
            />
          </div>
        </div>
        <div className={classes.postContent}>
          <img
            src={props.postData.postURL}
            onClick={doubleClickHandler}
            alt={`A post by ${props.postData.username}`}
          />
          <div className={classes.postActions}>
            <div id={props.postData._id} onClick={likePostHandler}>
              {props.isLiked ? (
                <FramerHeart hasClicked={true} />
              ) : (
                <FramerHeart hasClicked={false} />
              )}
            </div>
            <div>
              <img src={CommentIcon} alt="" className={classes.commentIcon} />
            </div>
            <div className={classes.savePostUnFill} onClick={savePostHandler}>
              {props.isSaved ? (
                <div>
                  <SavePost />
                </div>
              ) : (
                <div>
                  <SavePostUnfill />
                </div>
              )}
            </div>
          </div>

          {props.likes > 0 ? (
            <p className={classes.likes} onClick={() => setShowModal(true)}>
              {props.likes > 1 ? `${props.likes} likes` : `${props.likes} like`}
            </p>
          ) : null}

          <p className={classes.date}>
            {props.postData.day + " " + props.postData.date}
          </p>

          {props.postData.caption ? (
            <p>
              <strong>{props.postData.username}</strong>

              <span className={classes.caption}>{props.postData.caption}</span>
            </p>
          ) : null}
        </div>

        <div className={classes.commentSection}>
          {postComments ? (
            loadingComments ? (
              <EventActionSpinner />
            ) : (
              <div
                className={
                  postComments.length
                    ? classes.commentsContainer
                    : classes.hideComments
                }
              >
                {postComments?.map((comment) => (
                  <AnimatePresence>
                    <Comment
                      key={comment._id}
                      commentData={comment}
                      signedInUsername={state.userReducer.username}
                      deleteCommentHandler={() =>
                        deleteCommentHandler(props.postData._id, comment._id)
                      }
                    />
                  </AnimatePresence>
                ))}
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
              id={props.postData._id}
              disabled={comment.trim() === "" || comment.trim().length === 0}
              onClick={addCommentHandler}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Post;
