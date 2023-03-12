import React, { useEffect } from "react";
import axios from "axios";
import classes from "./NotificationDropDown.module.css";

function NotificationDropDown(props) {
  const readNotificationHandler = (notificationId) => {
    axios.put(`/notifications/${notificationId}`, {
      username: props.username,
    });
  };

  const notifications = props.notificationsData;
  return (
    <div className={classes.notificationContainer}>
      <div className={classes.notificationsBanner}>Notifications</div>
      {notifications?.map((notification) => (
        <div
          key={notification._id}
          className={
            notification.read
              ? classes.readNotification
              : classes.unreadNotification
          }
          onClick={() => readNotificationHandler(notification._id)}
        >
          <img src={notification.avatarURL} />
          <span>{notification.item}</span>
        </div>
      ))}
    </div>
  );
}

export default React.memo(NotificationDropDown);
