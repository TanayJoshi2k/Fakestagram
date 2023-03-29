import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import classes from "./Home.module.css";
import Navbar from "../Navbar/Navbar";
import Modal from "../Modal/Modal";
import PostModal from "../PostModal/PostModal";
import Post from "../Post/Post";
import {
  socketConnection,
  emitClientData,
  getNotifications,
} from "../Services/Socket";
import { setPosts } from "../redux/actions/postActions";
import { useSelector, useDispatch } from "react-redux";
import { saveUserDetails } from "../redux/actions/eventActions";

function Home(props) {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const [showPostModal, setShowPostModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [usersWhoLiked, setUsersWhoLiked] = useState([]);

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
  if (showPostModal) {
    // document.body.style.overflowY = "hidden";
  }
  return (
    <div className={classes.parentContainer}>
      {showModal && <Modal users={usersWhoLiked} />}
      {showPostModal && <PostModal />}

      <Navbar notifications={notifications} />

      <div className={classes.homePageContainer}>
        <div className={classes.postContainer}>
          {state.postReducer?.posts.map((post) => (
            <Post
              key={post._id}
              setShowModal={setShowModal}
              setUsersWhoLiked={() => setUsersWhoLiked(post.usernamesWhoLiked)}
              postData={post}
              isLiked={state.userReducer.likedPosts.includes(post._id)}
            />
          ))}
        </div>
      </div>

      {/* <div className={classes.sideContainer}>
        <button
            onClick={() => {
              setShowPostModal(true);
            }}
          >
            <span>Create Post</span>
          </button>
      </div> */}
    </div>
  );
}
export default Home;
