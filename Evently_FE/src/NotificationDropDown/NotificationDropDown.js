import React, { useEffect } from "react";
import axios from "axios";
import classes from "./NotificationDropDown.module.css";
import { useSelector } from "react-redux";

function NotificationDropDown(props) {
  const state = useSelector(state => state);
  const readNotificationHandler = (notificationId) => {
    axios.put(`/notifications/${notificationId}`, {
      username: props.username,
    });
  };
  const notifications = state.userReducer.notifications;
  return (
    <div className={classes.notificationContainer}>
      <div className={classes.notificationsBanner}>Notifications</div>
      {notifications?.map((notification) => {
        return (
          <div
            key={notification._id}
            className={
              notification.read
                ? classes.readNotification
                : classes.unreadNotification
            }
            onClick={() => readNotificationHandler(notification._id)}
          >
            <div className={classes.avatarURL}>
              <img src={notification.avatarURL} />
            </div>
            <div className={classes.content}>
              <p>{notification.username}</p>
              <p>{notification.item}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default NotificationDropDown;
