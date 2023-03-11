import React from "react";
import classes from "./Toast.module.css";

function Toast(props) {
  return (
    <div
      className={
        props.isErrorMessage ? classes.errorToast : classes.successToast
      }
    >
      <h6>{props.children}</h6>
    </div>
  );
}

export default Toast;
