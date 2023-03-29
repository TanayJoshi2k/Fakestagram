import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Comment from "../Comment/Comment";
import { addPostComment, getPostComments } from "../Services/PostService";
import { emitAddComment, emitLikePost } from "../Services/Socket";
import EventActionSpinner from "../Spinner/EventActionSpinner";
import Heart from "../Logos/Heart";
import HeartUnfill from "../Logos/HeartUnfill";
import CommentIcon from "../Assets/comment.png";
import EllipsisMenu from "../Assets/ellipsisMenu.png";
import Modal from "../Modal/Modal";
import axios from "axios";
import classes from "./Post.module.css";
import { setLikedPosts } from "../redux/actions/eventActions";

function Post(props) {
  console.log(props)
  const [comment, setComment] = useState("");
  const [postComments, setPostComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

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

  const getUserLikes = () => {
    props.setShowModal(true);
    props.setUsersWhoLiked()

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
      .put(`/posts/${postId}`, { username: state.userReducer.username })
      .then((res) => {
        dispatch(setLikedPosts(res.data.likedPosts));
      })
      .catch((e) => console.log(e));
  };

  return (
    <>
      <div key={props.postData._id} className={classes.post}>

        <div className={classes.postAuthorInfo}>
          <img src={props.postData.avatarURL} className={classes.avatarURL} />
          <p>
            <strong>{props.postData.username}</strong>
          </p>
          <div className={classes.moreActions}>
            <img src={EllipsisMenu} alt="..." />
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
          </div>

          {props.postData.usernamesWhoLiked.length ? (
            <p className={classes.likes} onClick={getUserLikes}>
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
