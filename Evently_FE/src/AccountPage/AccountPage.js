import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { emitFollowNotification } from "../Services/Socket";
import Navbar from "../Navbar/Navbar";
import Heart from "../Logos/Heart";
import HoverComment from "../Assets/comment_hover.png";
import axios from "axios";
import classes from "./AccountPage.module.css";
import { saveUserDetails } from "../redux/actions/userActions";

function AccountPage() {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const params = useParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState(params.username);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [posts, setPosts] = useState([]);

  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    axios
      .get(`/account/${username}`)
      .then((res) => {
        console.log(username, res)
        setPosts(res.data.posts);
        setBio(res.data.userDetails.bio);
        setFirstName(res.data.userDetails.firstName);
        setLastName(res.data.userDetails.lastName);
        setAvatar(res.data.userDetails.avatarURL);
        setFollowersCount(res.data.userDetails.followers.length);
        setFollowingCount(res.data.userDetails.following.length);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [params, username, state.userReducer.following]);

  const followHandler = () => {
    emitFollowNotification(username, state.userReducer.username);
    axios
      .put(`/account/follow/${username}`, {
        username: state.userReducer.username,
      })
      .then((res) => {
        dispatch(saveUserDetails({ following: res.data.following }));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const unfollowHandler = () => {
    axios
      .put(`/account/unfollow/${username}`, {
        username: state.userReducer.username,
      })
      .then((res) => {
        dispatch(saveUserDetails({ following: res.data.following }));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div>
      <Navbar notifications={state.userReducer.notifications} />
      <div className={classes.accountPageContainer}>
        <div className={classes.heroBanner}>
          <div className={classes.profilePicContainer}>
            <img src={avatar} alt="Profile Pic" />
            <p>{username}</p>
          </div>
          <div className={classes.meta}>
            <h2>
              {firstName || ""} {lastName || ""}
            </h2>
            {bio ? <p className={classes.bio}>{bio}</p> : null}
            <div>
              <p>
                <span>{state.userReducer.posts.length}</span>Posts
              </p>
              <p>
                <span>{followersCount}</span>Followers
              </p>
              <p>
                <span>{followingCount}</span>Following
              </p>
            </div>
            {state.userReducer.username !== username &&
            !state.userReducer.following.includes(username) ? (
              <button className={classes.followBtn} onClick={followHandler}>
                Follow
              </button>
            ) : null}
            {state.userReducer.username !== username &&
            state.userReducer.following.includes(username) ? (
              <button className={classes.followBtn} onClick={unfollowHandler}>
                Unfollow
              </button>
            ) : null}
          </div>
        </div>
        <div className={classes.postsContainer}>
          {posts.map((post) => (
            <div className={classes.post}>
              <img src={post.postURL} alt="" />
              <div className={classes.postInfoOverlay}>
                <div>
                  <Heart fillColor={"white"} width={20} height={20} />
                  <span>{post.likes}</span>
                </div>
                <div>
                  <img src={HoverComment} alt="..." />
                  <span>{post.comments.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
