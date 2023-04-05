import React from "react";
import { Link } from "react-router-dom";
import classes from "./UsersDropdown.module.css";

function UsersDropdown(props) {
  return (
    <div className={classes.dropdownContainer}>
      {props.searchResults.map((searchItem) => {
        return (
          <div key={Math.random()}>
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