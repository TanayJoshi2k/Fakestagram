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
        setFollowersCount(res.data.userDetails.followersCount)
        setFollowingCount(res.data.userDetails.followingCount)
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <div>
      <Navbar username={username} />
      <div className={classes.accountPageContainer}>
        <div className={classes.heroBanner}>
          <div className={classes.profilePicContainer}>
            <img src="https://www.popsci.com/uploads/2020/01/07/WMD5M52LJFBEBIHNEEABHVB6LA.jpg?auto=webp" />
          </div>
          <div className={classes.meta}>
            <h2>{firstName || ""} {lastName || ""}</h2>
            {bio?<p className={classes.bio}>{bio}</p>:null}
            <div>
              <button onClick={getFollowerList}>{followersCount} Followers</button>
              <button onClick={getFollowingList}>{followingCount} Following</button>
            </div>
            <button className={classes.followBtn}>Follow</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
