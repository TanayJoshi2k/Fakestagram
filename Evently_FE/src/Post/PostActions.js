import React from "react";
import classes from "./PostActions.module.css";
import { Link } from "react-router-dom";

function PostActions(props) {
  console.log(props);
  return (
    <div className={classes.modalContent}>
      <div>
        <Link
          to={`/posts/${props.postId}`}
        >
          Go to post
        </Link>
      </div>
      <div>
        <Link to={`/`}>Copy link</Link>
      </div>
    </div>
  );
}

export default PostActions;
