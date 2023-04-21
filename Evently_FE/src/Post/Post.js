import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Comment from "../Comment/Comment";
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

function Post(props) {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const [postComments, setPostComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPostActionsModal, setShowPostActionsModal] = useState(false);

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

  const likePostHandler = () => {
    const postId = props.postData._id;
    if (!props.isLiked) {
      emitLikePost(props.postData.username, state.userReducer.username);
    }
    axios
      .put(`/posts/${postId}`, {
        username: state.userReducer.username,
        avatarURL: state.userReducer.avatarURL,
        name: state.userReducer.firstName + " " + state.userReducer.lastName,
      })
      .then((res) => {
        dispatch(setLikedPosts(res.data.likedPosts));
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
        console.log(res);
        dispatch(setSavedPosts(res.data.savedPosts));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      {showModal && (
        <Modal closeModal={() => setShowModal(false)} title="Likes">
          <ShowUserLikes users={props.postData.usernamesWhoLiked} />
        </Modal>
      )}

      {showPostActionsModal && (
        <Modal closeModal={() => setShowPostActionsModal(false)}>
          <PostActions
            postId={props.postData._id}
            users={props.postData.usernamesWhoLiked}
            postData={props.postData}
          />
        </Modal>
      )}

      <div key={props.postData._id} className={classes.post}>
        <div className={classes.postAuthorInfo}>
          <img src={props.postData.avatarURL} className={classes.avatarURL} />
          <p>{props.postData.username}</p>
          <div className={classes.moreActions}>
            <img
              src={EllipsisMenu}
              alt="..."
              onClick={() => {
                setShowPostActionsModal(true);
                dispatch(viewCurrentPost(props.postData))
              }}
            />
          </div>
        </div>
        <div className={classes.postContent}>
          <img src={props.postData.postURL} height={100} />
          <div className={classes.postActions}>
            <div id={props.postData._id} onClick={likePostHandler}>
              {props.isLiked ? (
                <div className={classes.heartFill}>
                  <Heart className={classes.heartFill} width={22} heiht={22} />
                </div>
              ) : (
                <div className={classes.heartUnFill}>
                  <HeartUnfill className={classes.heartUnFill} />
                </div>
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

          {props.postData.usernamesWhoLiked.length ? (
            <p className={classes.likes} onClick={() => setShowModal(true)}>
              {props.postData.usernamesWhoLiked.length > 1
                ? `${props.postData.usernamesWhoLiked.length} likes`
                : `${props.postData.usernamesWhoLiked.length} like`}
            </p>
          ) : null}

          {props.postData.caption ? (
            <p>
              <strong>{props.postData.username}</strong>

              <span>{props.postData.caption}</span>
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
                {postComments?.map((comment) => {
                  if (comment) {
                    return (
                      <Comment
                        key={comment._id}
                        commentData={comment}
                        signedInUsername={state.userReducer.username}
                        deleteCommentHandler={() =>
                          deleteCommentHandler(props.postData._id, comment._id)
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
