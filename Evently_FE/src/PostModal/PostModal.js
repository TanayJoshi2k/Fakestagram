import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProgressBar from "../ProgressBar/ProgressBar";
import { setPosts } from "../redux/actions/postActions";
import axios from "axios";
import { motion } from "framer-motion";
import classes from "./PostModal.module.css";

function PostModal(props) {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const [postURL, setPostURL] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const handlePostInput = (e) => {
    setFile(e.target.files[0]);
    const url = URL.createObjectURL(e.target.files[0]);
    setPostURL(url);
  };

  const sharePost = () => {
    const formData = new FormData();
    formData.append("username", state.userReducer.username);
    formData.append("post", file);
    formData.append("avatarURL", state.userReducer.avatarURL);
    formData.append("caption", caption);

    axios
      .post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (data) => {
          //Set the progress value to show the progress bar
          setProgress(Math.round((100 * data.loaded) / data.total));
        },
      })
      .then((res) => {
        props.setShowPostModal(false);
        setProgress(0);
        dispatch(setPosts(res.data.posts));
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className={classes.postModalContainer}>
        <motion.div key="addPostModal" className={classes.postModal}
        initial={{
          opacity: 0,
          scale: 0.75,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: {
            ease: "easeOut",
            duration: 0.15,
          },
        }}
        exit={{
          opacity: 0,
          scale: 0.75,
          transition: {
            ease: "easeIn",
            duration: 0.15,
          },
        }}>
          <button
            onClick={() => {
              props.setShowPostModal(false);
            }}
            className={classes.closeBtn}
          ></button>
          <h2>New Post</h2>
          <hr />
          <div>
            <label htmlFor="post" className={classes.profilePicLabel}>
              Choose File
            </label>
            <input
              id="post"
              type="file"
              name="post"
              accept="image/png, image/jpg, image/jpeg"
              style={{ display: "none" }}
              onChange={handlePostInput}
            />
          </div>
          {postURL && (
            <div className={classes.imgContainer}>
              <img src={postURL} alt="" />
              <textarea
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption"
              ></textarea>
              <div className={classes.progressBar}></div>
              <button onClick={sharePost}>Share</button>
            </div>
          )}
          <ProgressBar progress={progress} />
        </motion.div>
    </div>
  );
}

export default PostModal;
