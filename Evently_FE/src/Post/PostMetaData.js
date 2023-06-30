import React from "react";
import classes from "./PostMetaData.module.css";
function PostMetaData(props) {
  const { day, date, caption, username, likes } = props;
  return (
    <>
      {props.likes > 0 ? (
        <p className={classes.likes} onClick={() => props.setShowModal(true)}>
          {props.likes > 1 ? `${props.likes} likes` : `${likes} like`}
        </p>
      ) : null}
      <p className={classes.date}>{day + " " + date}</p>
      <p>
        <strong>{username}</strong>
        <span className={classes.caption}>{caption}</span>
      </p>
    </>
  );
}

export default PostMetaData;
