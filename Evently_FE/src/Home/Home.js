import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import classes from "./Home.module.css";
import Navbar from "../Navbar/Navbar";
import PostModal from "../PostModal/PostModal";
import Post from "../Post/Post";
import {
  socketConnection,
  emitClientData,
  getNotifications,
  getLastNotification,
} from "../Services/Socket";
import { setPosts } from "../redux/actions/postActions";
import { useSelector, useDispatch } from "react-redux";
import { saveUserDetails, setNotification } from "../redux/actions/userActions";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "../Toast/Toast";

function Home() {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const [showPostModal, setShowPostModal] = useState(false);
  const [error, setError] = useState("");
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

  useEffect(() => {
    getPosts();
    let socket = socketConnection();

    socket.on("connect", () => {
      emitClientData(state.userReducer.username);
      getNotifications(state.userReducer.username, (data) => {
        dispatch(saveUserDetails({ notifications: [...data.notifications] }));
      });
    });

    getLastNotification((data) => {
      console.log(data);
      dispatch(setNotification(data));
    });
  }, []);

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
      </div>
    </motion.div>
  );
}
export default Home;
