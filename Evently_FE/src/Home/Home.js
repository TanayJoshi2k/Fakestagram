import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import classes from "./Home.module.css";
import Navbar from "../Navbar/Navbar";
import PostModal from "../PostModal/PostModal";
import Post from "../Post/Post";
import {
  socketConnection,
  emitClientData,
  getNotifications,
  getLastNotification,
  emitFollowNotification,
} from "../Services/Socket";
import { setPosts } from "../redux/actions/postActions";
import { useSelector, useDispatch } from "react-redux";
import { saveUserDetails, setNotification } from "../redux/actions/userActions";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "../Toast/Toast";
import EventActionSpinner from "../Spinner/EventActionSpinner";

function Home() {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const [showPostModal, setShowPostModal] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getPosts = async () => {
    axios
      .get("/posts")
      .then((res) => {
        let posts = {};
        res.data.posts.forEach((post) => {
          const postId = post._id;
          posts[postId] = post;
        });
        dispatch(setPosts(posts));
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getSuggestions = async () => {
    setLoading(true);
    axios
      .get("/suggestions")
      .then((res) => {
        setLoading(false);
        setSuggestions(res.data.suggestions);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  };

  const followHandler = (e) => {
    const username = e.target.id;
    emitFollowNotification(username, state.userReducer.username);
    // setLoading(true);
    axios
      .put(`/account/follow/${username}`, {
        username: state.userReducer.username,
      })
      .then((res) => {
        // setLoading(false);
        console.log(res.data);
        dispatch(saveUserDetails({ following: res.data.following }));
      })
      .catch((e) => {
        // setLoading(false);
        console.log(e);
      });
  };

  useEffect(() => {
    getPosts();
    getSuggestions();
    let socket = socketConnection();

    socket.on("connect", () => {
      emitClientData(state.userReducer.username);
      getNotifications(state.userReducer.username, (data) => {
        dispatch(saveUserDetails({ notifications: [...data.notifications] }));
      });
    });

    getLastNotification((data) => {
      dispatch(setNotification(data));
    });
  }, []);

  useEffect(() => {
    getSuggestions();
  }, [state.userReducer.following]);

  const posts = [];

  Object.keys(state.postReducer.posts).forEach((postId) => {
    posts.push(
      <Post
        key={state.postReducer.posts[postId]._id}
        postId={state.postReducer.posts[postId]._id}
        usernamesWhoLiked={state.postReducer.posts[postId].usernamesWhoLiked}
        postData={state.postReducer.posts[postId]}
        isLiked={state.userReducer.likedPosts?.includes(postId)}
        isSaved={state.userReducer.savedPosts?.includes(postId)}
        likes={state.postReducer.posts[postId].likes}
        setError={setError}
      />
    );
  });

  useEffect(() => {
    if (error !== "") {
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  }, [error]);

  return (
    <motion.div
      className={classes.parentContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {showPostModal && (
        <AnimatePresence>
          <PostModal key="addPostModal" setShowPostModal={setShowPostModal} />
        </AnimatePresence>
      )}

      <Navbar setShowPostModal={setShowPostModal} />

      <div className={classes.homePageContainer}>
        <div className={classes.postContainer}>{posts}</div>

        {error && <Toast isErrorMessage={true}>{error}</Toast>}
        <div className={classes.suggestionsContainer}>
          <p>Suggestions for you</p>
          {loading && <EventActionSpinner />}
          {suggestions.map((suggestion) => (
            <div className={classes.suggestion}>
              <img src={suggestion.avatarURL} />
              <div className={classes.userInfo}>
                <Link to={`/account/${suggestion.username}`}>
                  {suggestion.username}
                </Link>
                <p>{suggestion.firstName + " " + suggestion.lastName}</p>
              </div>
              <button
                id={suggestion.username}
                className={classes.followBtn}
                onClick={followHandler}
              >
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
export default Home;
