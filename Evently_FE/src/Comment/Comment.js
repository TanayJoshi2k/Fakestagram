import React, { useEffect, useState } from "react";
import classes from "./Comment.module.css";
import { Link } from "react-router-dom";
import axios from "axios";

function Comment(props) {
  
  return (
    <div className={classes.comment}>
      <img src={props.commentData.avatarURL} />
      <Link className={classes.username} to={`/account/${props.commentData.username}`}>
        {props.commentData.username}
      </Link>
      <span className={classes.commentText}>{props.commentData.comment}</span>

      {props.signedInUsername === props.commentData.username ? (
        <div className={classes.deleteComment}>
          <button onClick={props.deleteCommentHandler}>Delete</button>
        </div>
      ) : null}
    </div>
  );
}

export default Comment;
