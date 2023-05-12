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

function Home() {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const [showPostModal, setShowPostModal] = useState(false);
  const [notifications, setNotifications] = useState([]);

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
      />
    );
  });
  return (
    <div className={classes.parentContainer}>
      {showPostModal && <PostModal setShowPostModal={setShowPostModal} />}
      <Navbar notifications={notifications} />

      <div className={classes.homePageContainer}>
        <div className={classes.postContainer}>{posts}</div>
      </div>

      <div className={classes.sideContainer}>
        <button
          onClick={() => {
            setShowPostModal(true);
          }}
        >
          <span>Create Post</span>
        </button>
      </div>
    </div>
  );
}
export default Home;
