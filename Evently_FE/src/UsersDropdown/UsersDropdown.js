import React from "react";
import { Link, useNavigate } from "react-router-dom";
import classes from "./UsersDropdown.module.css";

function UsersDropdown(props) {
  const navigate = useNavigate();
  return (
    <div className={classes.dropdownContainer}>
      {props.searchResults.map((searchItem) => {
        return (
          <div
            key={searchItem._id}
            onClick={() => navigate(`/account/${searchItem.username}`)}
          >
            <img src={searchItem.avatarURL} alt="" />
            <Link to={`/account/${searchItem.username}`}>
              {searchItem.username}
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default UsersDropdown;
