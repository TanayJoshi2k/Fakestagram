import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LogoutIcon from "../Assets/logout.png";
import UserIcon from "../Assets/user.svg";
import classes from "./Dropdown.module.css";

function Dropdown(props) {
  const navigate = useNavigate();

  const logoutHandler = () => {
    axios
      .post("/logout")
      .then((res) => {
        props.setIsAuth(false);
        navigate("/");
      })
      .catch((e) => {
        console.log(e);
        alert("Something went wrong");
      });
  };

  return (
    <div className={classes.dropdownContainer}>
      <div
        className={classes.profileLinkCotaniner}
        onClick={() => navigate(`/account/${props.username}`)}
      >
        <img src={UserIcon} alt="" />
        <Link
          className={classes.profileLink}
          to={`/account/:${props.username}`}
        >
          Profile
        </Link>
      </div>
      <div>
        <img src={LogoutIcon} alt="" />
        <button onClick={logoutHandler}>Logout</button>
      </div>
    </div>
  );
}

export default Dropdown;
