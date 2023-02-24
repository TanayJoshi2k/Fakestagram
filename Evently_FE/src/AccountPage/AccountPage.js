import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import classes from "./AccountPage.module.css";

function AccountPage(props) {
  const params = useParams();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState(params.username);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [avatar, setAvatar] = useState("");

  const getFollowerList = () => {
    axios
      .get("/followers")
      .then((res) => console.log(res))
      .catch((e) => console.log(e));
  };

  const getFollowingList = () => {
    axios
      .get("/following")
      .then((res) => console.log(res))
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    axios
      .get(`/account/${username}`)
      .then((res) => {
        console.log(res);
        setBio(res.data.userDetails.bio);
        setFirstName(res.data.userDetails.firstName);
        setLastName(res.data.userDetails.lastName);
        setFollowersCount(res.data.userDetails.followersCount);
        setFollowingCount(res.data.userDetails.followingCount);
        setAvatar(res.data.userDetails.avatarURL);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [username]);

  return (
    <div>
      <Navbar username={props.username} />
      <div className={classes.accountPageContainer}>
        <div className={classes.heroBanner}>
          <div className={classes.profilePicContainer}>
            <img src={avatar} alt="Profile Pic" />
          </div>
          <div className={classes.meta}>
            <h2>
              {firstName || ""} {lastName || ""}
            </h2>
            {bio ? <p className={classes.bio}>{bio}</p> : null}
            <div>
              <button onClick={getFollowerList}>
                {followersCount} Followers
              </button>
              <button onClick={getFollowingList}>
                {followingCount} Following
              </button>
            </div>
            {props.username !== username ? (
              <button className={classes.followBtn}>Follow</button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
