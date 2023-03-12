import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import notificationTray from "../Assets/notification_tray.png";
import Dropdown from "./Dropdown";
import UsersDropdown from "../UsersDropdown/UsersDropdown";
import NotificationDropDown from "../NotificationDropDown/NotificationDropDown";
import Search from "../Assets/search.png";
import axios from "axios";
import classes from "./Navbar.module.css";

function Navbar(props) {
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [toggleNotificationTray, setToggleNotificationTray] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (search === "") {
      setSearchResults([]);
    } else {
      const timer = setTimeout(() => {
        axios
          .get(`/search/${search}`)
          .then((res) => {
            setSearchResults(res.data.searchResults);
          })
          .catch((e) => {
            console.log(e);
          });
      }, 500);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [search]);

  return (
    <header>
      <nav>
        <div className={classes.mobileMenu}>
          <span onClick={() => setShowMobileMenu(!showMobileMenu)}>☰</span>
        </div>
        <ul className={classes.navbarContainer}>
          <p onClick={() => navigate("/")}>Evently</p>

          <div className={classes.searchContainer}>
            <img src={Search} alt="" />
            <input
              type="search"
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <UsersDropdown searchResults={searchResults} />
          </div>

          <div
            className={classes.notificationsContainer}
            onClick={() => {
              setToggleNotificationTray(!toggleNotificationTray);
            }}
          >
            <img src={notificationTray} alt="" height={20} width={20} />
            {props.notifications?.length > 0 ? (
              <span className={classes.notificationCount}>
                {props.notifications?.length}
              </span>
            ) : null}
            {toggleNotificationTray ? (
              <NotificationDropDown notificationsData={props.notifications} username={props.username}/>
            ) : null}
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
