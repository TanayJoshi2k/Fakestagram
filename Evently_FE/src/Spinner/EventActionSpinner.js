import React from "react";
import classes from "./EventActionSpinner.module.css";

function EventActionSpinner(props) {
  return (
    <div className={classes.spinnerContainer}>
      <div className={classes.spinner}></div>
    </div>
  );
}
export default EventActionSpinner;
