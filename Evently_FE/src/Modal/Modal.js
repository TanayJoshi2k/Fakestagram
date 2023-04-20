import React from "react";
import classes from "./Modal.module.css";

function Modal(props) {
  
  return (
    <div className={classes.modalContainer}>
      <div className={classes.modal}>
        <div className={classes.modalRibbon}>
          <p>Likes</p>
          <button
            onClick={() => {
              props.setShowModal(false);
            }}
            className={classes.closeBtn}
          ></button>
        </div>
        {props.children}
      </div>
    </div>
  );
}

export default Modal;
