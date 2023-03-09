import React from "react";
import { Link } from "react-router-dom";
import classes from "./UsersDropdown.module.css";

function UsersDropdown(props) {
  return (
    <div className={classes.dropdownContainer}>
      {props.searchResults.map((searchItem) => {
        return (
          <div key={Math.random()}>

            {searchItem?.avatarURL ? (
              <img src={searchItem.avatarURL} alt="" />
            ) : (
              <p>Event:</p>
            )}

            <Link to={`/account/${searchItem?.username}`}>
              {searchItem?.username}
            </Link>

            {searchItem?.title ? (
              <Link to={`/account/${searchItem?.title}`}>
                {searchItem?.title}
              </Link>
            ) : null}
            
          </div>
        );
      })}
    </div>
  );
}

export default UsersDropdown;
