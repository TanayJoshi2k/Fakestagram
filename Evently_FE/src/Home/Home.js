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
} from "../Services/Socket";
import { setPosts } from "../redux/actions/postActions";
import { useSelector, useDispatch } from "react-redux";
import { saveUserDetails } from "../redux/actions/userActions";
import { motion, AnimatePresence } from "framer-motion";

function Home() {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const [showPostModal, setShowPostModal] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const getPosts = async () => {
    axios
      .get("/posts")
      .then((res) => {
        dispatch(setPosts(res.data.posts));
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
  }, []);

  useEffect(() => {
    getPosts();
  }, [state.userReducer.likedPosts]);

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

      <Navbar
        notifications={notifications}
        setShowPostModal={setShowPostModal}
      />

      <div className={classes.homePageContainer}>
        <div className={classes.postContainer}>
          {state.postReducer?.posts.map((post) => (
            <Post
              key={post._id}
              usernameswholiked={post.usernamesWhoLiked}
              postData={post}
              isLiked={state.userReducer.likedPosts?.includes(post._id)}
              isSaved={state.userReducer.savedPosts?.includes(post._id)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
export default Home;
