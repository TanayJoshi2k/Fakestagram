import React, { useEffect, useState } from "react";
import classes from "./Comment.module.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Comment(props) {
  return (
    <motion.div
      className={classes.comment}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { ease: "easeInOut", duration: 1 } }}
      exit={{
        transition: {
          ease: "easeInOut",
          duration: 2,
        },
      }}
    >
      <img src={props.commentData.avatarURL} />
      <Link
        className={classes.username}
        to={`/account/${props.commentData.username}`}
      >
        {props.commentData.username}
      </Link>
      <span className={classes.commentText}>{props.commentData.comment}</span>

      {props.signedInUsername === props.commentData.username ? (
        <div className={classes.deleteComment}>
          <button onClick={props.deleteCommentHandler}>Delete</button>
        </div>
      ) : null}
    </motion.div>
  );
}

export default Comment;
