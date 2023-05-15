import React, { useState } from "react";
import classes from "./PostActions.module.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/actions/postActions";
import Toast from "../Toast/Toast";
import axios from "axios";

function PostActions(props) {
  const dispatch = useDispatch();
  const deletePostHandler = () => {
    const postId = props.postId;
    axios
      .delete(`/posts/${postId}`)
      .then((res) => {
        dispatch(setPosts(res.data.posts));
      })
      .catch((e) => {
        props.setError(e.response.data.error);
      });
  };

  return (
    <div className={classes.modalContent}>
      <div>
        <Link to={`/posts/${props.postId}`}>Go to post</Link>
      </div>
      <div>
        <Link to={`/`}>Copy link</Link>
      </div>
      {props.postData.username === props.loggedInUser ? (
        <button className={classes.deleteBtn} onClick={deletePostHandler}>
          Delete
        </button>
      ) : null}
    </div>
  );
}

export default PostActions;
