import React from "react";
import classes from "./Modal.module.css";

function Modal(props) {
  return (
    <div className={classes.modalContainer}>
      <div className={classes.modal}>
        <div className={classes.modalRibbon}>
          <p>{props.title}</p>
          <button
            onClick={() => {
              props.closeModal(false);
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
