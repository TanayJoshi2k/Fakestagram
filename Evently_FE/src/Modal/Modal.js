import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { saveUserDetails } from "../redux/actions/eventActions";
import { emitFollowNotification } from "../Services/Socket";
import {Link} from "react-router-dom";
import EventActionSpinner from "../Spinner/EventActionSpinner";
import axios from "axios";
import classes from "./Modal.module.css";

function Modal(props) {
  const users = props.users;
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const [loading, setLoading] = useState(false);
  let spinner;

  const followHandler = (e) => {
    const username = e.target.id;
    emitFollowNotification(username, state.userReducer.username);
    setLoading(true);
    axios
      .put(`/account/follow/${username}`, {
        username: state.userReducer.username,
      })
      .then((res) => {
        setLoading(false);
        dispatch(saveUserDetails({ following: res.data.following }));
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  };

  const unfollowHandler = (e) => {
    const username = e.target.id;
    setLoading(true);
    axios
      .put(`/account/unfollow/${username}`, {
        username: state.userReducer.username,
      })
      .then((res) => {
        setLoading(false);
        dispatch(saveUserDetails({ following: res.data.following }));
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  };
  if (loading) {
    spinner = <EventActionSpinner />;
  }
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
        <div className={classes.modalContent}>
          {users.map((user) => {
            let button = null;

            if (state.userReducer.username !== user.username) {
              let isFollowing = state.userReducer.following.includes(
                user.username
              );
              if (isFollowing) {
                button = (
                  <button
                    id={user.username}
                    className={classes.unfollowBtn}
                    onClick={unfollowHandler}
                  >
                    Following
                  </button>
                );
              } else {
                button = (
                  <button
                    id={user.username}
                    className={classes.followBtn}
                    onClick={followHandler}
                  >
                    Follow
                  </button>
                );
              }
            }

            return (
              <div className={classes.user}>
                <img src={user.avatarURL} />
                <div className={classes.userInfo}>
                  <Link to={`/account/${user.username}`}>
                    {user.username}
                  </Link>
                  <p>{user.name}</p>
                </div>
                {spinner?spinner:button}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Modal;
