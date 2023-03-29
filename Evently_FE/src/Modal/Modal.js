import React from "react";
import classes from "./Modal.module.css";

function Modal(props) {
    const users = props.users
  return (
    <div className={classes.modalContainer}>
      <div className={classes.modal}>
      <button className={classes.closeBtn}></button>
        {users.map((username) => (
          <div>{username}</div>
        ))}
      </div>
    </div>
  );
}

export default Modal;
