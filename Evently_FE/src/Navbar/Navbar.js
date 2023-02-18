import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";
import classes from "./Navbar.module.css";

function Navbar(props) {
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <header>
      <nav>
        <ul className={classes.navbarContainer}>
          <p onClick={() => navigate("/")}>Evently</p>
          <div>
            <li>MY EVENTS</li>
            <li>INVITES</li>
          </div>
          <div
            className={classes.menuCotainer}
            onClick={() => setToggleDropdown(!toggleDropdown)}
          >
            {props.username}▾
            {toggleDropdown ? (
              <Dropdown username={props.username} setIsAuth={props.setIsAuth} />
            ) : null}
          </div>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
