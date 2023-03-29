import react, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import classes from "./PostModal.module.css";

function PostModal() {
  const state = useSelector((state) => state);
  const [postURL, setPostURL] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);

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

    axios
      .post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => console.log(res))
      .catch((e) => console.log(e));
  };

  return (
    <div className={classes.postModalContainer}>
      <div className={classes.postModal}>
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
      </div>
    </div>
  );
}

export default PostModal;
