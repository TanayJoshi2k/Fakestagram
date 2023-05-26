import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import notificationTray from "../Assets/tray.png";
import Dropdown from "./Dropdown";
import UsersDropdown from "../UsersDropdown/UsersDropdown";
import NotificationDropDown from "../NotificationDropDown/NotificationDropDown";
import Search from "../Assets/search.png";
import axios from "axios";
import classes from "./Navbar.module.css";
import Home from "../Assets/home.png";
import Compass from "../Assets/compass.png";
import AddPost from "../Assets/add.png";

function getNotificationCount(notifications) {
  let notificationCount = 0;
  notifications.forEach((notification) => {
    if (!notification.read) {
      notificationCount += 1;
    }
  });
  return notificationCount;
}

function Navbar(props) {
  const userData = useSelector((state) => state.userReducer);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [toggleNotificationTray, setToggleNotificationTray] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();
  console.log("Rendering Navbar")
  useEffect(() => {
    if (search === "") {
      setSearchResults([]);
    } else {
      const timer = setTimeout(() => {
        axios
          .get(`/search/${search}`)
          .then((res) => {
            setSearchResults(res.data.usersFound);
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

  useEffect(() => {
    setNotificationCount(getNotificationCount(userData.notifications));
  }, []);

  return (
    <header>
      <nav>
        {!showMobileMenu && (
          <div
            className={classes.hamburgerIcon}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            ☰
          </div>
        )}

        {showMobileMenu && (
          <div
            className={classes.hamburgerIcon}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            ✖
          </div>
        )}

        {showMobileMenu && (
          <div className={classes.mobileMenuContainer}>
            <p onClick={() => navigate("/")}>Instagram</p>
            <img
              width={23}
              src={AddPost}
              alt="Add Post"
              onClick={() => {
                props.setShowPostModal(true);
              }}
            />
            <img src={Home} width={23} height={23} alt="Home Icon" />
            <img src={Compass} width={23} height={23} alt="Explore Icon" />
            <img
              className={classes.mobileProfilePic}
              src={userData.userReducer.avatarURL}
              aria-hidden="true"
              alt=""
              onClick={() => setToggleDropdown(!toggleDropdown)}
            />
          </div>
        )}

        <ul className={classes.navbarContainer}>
          <p onClick={() => navigate("/")}>Instagram</p>

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

          <div className={classes.iconsContainer}>
            <img
              width={23}
              src={AddPost}
              alt="Add Post"
              onClick={() => {
                props.setShowPostModal(true);
              }}
            />
            <img src={Home} width={23} height={23} alt="Home Icon" />
            <img src={Compass} width={23} height={23} alt="Explore Icon" />
            <div
              className={classes.notificationsContainer}
              onClick={() => {
                setToggleNotificationTray(!toggleNotificationTray);
              }}
            >
              <img
                src={notificationTray}
                alt="Notification Tray"
                height={20}
                width={20}
              />
              {notificationCount ? (
                <span className={classes.notificationCount}>
                  {notificationCount}
                </span>
              ) : null}
            </div>
            {toggleNotificationTray ? <NotificationDropDown /> : null}
            <img
              className={classes.profilePic}
              src={userData.avatarURL}
              aria-hidden="true"
              alt=""
              onClick={() => setToggleDropdown(!toggleDropdown)}
            />
            {toggleDropdown ? <Dropdown /> : null}
          </div>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
