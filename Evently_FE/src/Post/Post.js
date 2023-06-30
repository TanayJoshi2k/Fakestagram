import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Comments from "../Comments/Comments";
import { Link } from "react-router-dom";
import PostActions from "./PostActions";
import ShowUserLikes from "../DisplayUserLikes/ShowUserLikes";
import { addPostComment, getPostComments } from "../Services/PostService";
import { emitAddComment, emitLikePost } from "../Services/Socket";
import EventActionSpinner from "../Spinner/EventActionSpinner";
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
import { setPostDetails } from "../redux/actions/postActions";
import { AnimatePresence } from "framer-motion";
import FramerHeart from "../Logos/FramerHeart";
import PostMetaData from "./PostMetaData";

function Post(props) {
  const state = useSelector((state) => state.userReducer);
  const { postData } = props;
  const {
    _id: postId,
    username: postAuthor,
    usernamesWhoLiked,
    postURL,
    day,
    date,
    caption,
  } = postData;

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
    getPostCommentsHandler(postId);
  }, []);

  const addCommentHandler = (event) => {
    const postId = event.target.id;
    let loggedInUser = {
      username: state.username,
      avatarURL: state.avatarURL,
    };
    emitAddComment(comment, loggedInUser, postAuthor);

    addPostComment(
      postId,
      state,
      comment,
      postComments,
      setPostComments,
      setComment
    );
  };

  const deleteCommentHandler = (postId, commentId) => {
    axios
      .delete(`/posts/${postId}/comments/${commentId}`)
      .then((res) => {
        setPostComments([...res.data.comments]);
      })
      .catch((e) => {
        props.setError(e.response.data.error);
      });
  };

  const doubleClickHandler = (e) => {
    if (e.detail === 2) {
      likePostHandler();
    }
  };

  const likePostHandler = () => {
    if (!props.isLiked) {
      let loggedInUser = {
        username: state.username,
        avatarURL: state.avatarURL,
      };
      emitLikePost(postAuthor, loggedInUser);
    }
    axios
      .put(`/posts/${postId}`, {
        username: state.username,
        avatarURL: state.avatarURL,
        name: state.firstName + " " + state.lastName,
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
    axios
      .put(`/posts/savepost/${postId}`, {
        username: state.username,
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
            <ShowUserLikes users={usernamesWhoLiked} />
          </Modal>
        )}

        {showPostActionsModal && (
          <Modal key="modal" closeModal={() => setShowPostActionsModal(false)}>
            <PostActions
              postId={postId}
              users={usernamesWhoLiked}
              postData={postData}
              loggedInUser={state.username}
              setError={props.setError}
            />
          </Modal>
        )}
      </AnimatePresence>

      <div key={postId} className={classes.post}>
        <div className={classes.postAuthorInfo}>
          <img src={postData.avatarURL} className={classes.avatarURL} />
          <Link to={`/account/${postAuthor}`}>{postAuthor}</Link>
          <div className={classes.moreActions}>
            <img
              src={EllipsisMenu}
              alt="..."
              onClick={() => {
                setShowPostActionsModal(true);
                dispatch(viewCurrentPost(postData));
              }}
            />
          </div>
        </div>
        <div className={classes.postContent}>
          <img
            src={postURL}
            onClick={doubleClickHandler}
            alt={`A post by ${postAuthor}`}
          />
          <div className={classes.postActions}>
            <div id={postId} onClick={likePostHandler}>
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
              {props.isSaved ? <SavePost /> : <SavePostUnfill />}
            </div>
          </div>
          <PostMetaData
            likes={props.likes}
            caption={caption}
            username={postAuthor}
            day={day}
            date={date}
            setShowModal={setShowModal}
          />
        </div>

        <div className={classes.commentSection}>
          {loadingComments ? (
            <EventActionSpinner />
          ) : (
            <div
              className={
                postComments.length
                  ? classes.commentsContainer
                  : classes.hideComments
              }
            >
              <Comments
                comments={postComments}
                deleteCommentHandler={deleteCommentHandler}
                postId={postId}
              />
            </div>
          )}
          <div className={classes.inputCommentContainer}>
            <input
              type="text"
              placeholder="Add a comment..."
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
            <button
              id={postId}
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