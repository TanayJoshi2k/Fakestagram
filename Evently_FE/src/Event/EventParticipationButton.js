import React, { useEffect, useState } from "react";
import classes from "./EventParticipationButton.module.css";
import Comment from "../Comment/Comment";
import axios from "axios";

function EventParticipationButton(props) {
  return (
    <button
      id={props.eventId}
      onClick={(e) => props.eventParticipationHandler(e, props.action)}
      className={classes[`${props.action}Btn`]}
    >
      {props.children}
    </button>
  );
}

export default EventParticipationButton;
