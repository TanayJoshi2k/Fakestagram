import React, { useEffect } from "react";
import classes from "./NotificationDropDown.module.css";

function NotificationDropDown(props) {
  const notifications = props.notificationsData;
  return (
    <div className={classes.notificationContainer}>
      {notifications?.map((notification) => (
        <div key={notification._id} className={classes.notification}>
          <img src={notification.avatarURL} />
          <span>{notification.item}</span>
        </div>
      ))}
    </div>
  );
}

export default NotificationDropDown;
