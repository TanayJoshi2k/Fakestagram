import React from "react";
import classes from "./Navbar.module.css";

function Navbar(props) {
  return (
    <header>
      <nav>
        <ul className={classes.navbarContainer}>
          <p>Evently</p>
          <div>
            <li>MY EVENTS</li>
            <li>INVITES</li>
          </div>
          <p>{props.username}</p>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
