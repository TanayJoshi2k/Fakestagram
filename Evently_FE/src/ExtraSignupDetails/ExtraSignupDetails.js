import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import classes from "./ExtraSignupDetails.module.css";
import Spinner from "../Spinner/Spinner";
import DefaultProfilePic from "../Assets/download.png"

function ExtraSignupDetails(props) {
  console.log(props)
  const state = useSelector(state => state)
  const bioRegex = /[^a-z A-Z0-9@_.!-#*]*$/i;
  const nameRegex = /[^a-z A-Z]*$/i;
  const [displayAvatarURL, setDisplayAvatarURL] = useState(DefaultProfilePic);
  const [extraFormData, setExtraFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    gender: "",
    username: props.username,
    avatar: "",
  });
  const [showSpinner, setShowSpinner] = useState(false);

  const MAX_CHARS = 150;
  const navigate = useNavigate();

  const handleInput = (e) => {

    const name = e.target.name;
    let value = "";

    if (name === "avatar") {
      const url = URL.createObjectURL(e.target.files[0])
      setDisplayAvatarURL(url)
      setExtraFormData({
        ...extraFormData,
        [name]: e.target.files[0],
      });

    } else if (name === "bio") {
      value = e.target.value.replace(bioRegex, "");
      setExtraFormData({
        ...extraFormData,
        [name]: value.slice(0, MAX_CHARS),
      });
    } else {
      value = e.target.value.replace(nameRegex, "");
      setExtraFormData({
        ...extraFormData,
        [name]: value,
      });
    }
  };

  const submitHandler = () => {
    const formData = new FormData();
    for (let field in extraFormData) {
      formData.append(field, extraFormData[field] || "")
    }
    setShowSpinner(true);
    axios
      .post("/secondSignupStep", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setShowSpinner(false);
        navigate("/home", { state: { username: props.username } });
      })
      .catch((e) => console.log(e));
  };

  if (showSpinner) return <Spinner />

  return (
    <div className={classes.extraDetailsContainer}>
      <div className={classes.heroContainer}>
        <h1>Almost there.</h1>
        <h1 className={classes.hero}>Let others know you better!</h1>
      </div>

      <div>
        <label htmlFor="profilePic" className={classes.profilePicLabel} style={{background:`url(${displayAvatarURL})`}}></label>
        <input
          id="profilePic"
          type="file"
          name="avatar"
          accept="image/png, image/jpg, image/jpeg"
          style={{ display: "none" }}
          onChange={handleInput}
        />
      </div>

      <div className={classes.extraDetailsFormContainer}>
        <div className={classes.banner}>
          {/* <p>Help others know you better</p> */}
          {/* <div>
            <img src={smileyEmoji} alt="" />
          </div> */}
        </div>

        <form className={classes.extraDetailsForm}>
          <div
            className={[classes.extraDetailsFormControl, classes.name].join(
              " "
            )}
          >
            <div>
              <label htmlFor="fname">First Name</label>
              <input
                id="fname"
                name="firstName"
                value={extraFormData.firstName}
                onChange={handleInput}
              />
            </div>
            <div>
              <label htmlFor="lname">Last Name</label>
              <input
                id="lname"
                name="lastName"
                value={extraFormData.lastName}
                onChange={handleInput}
              />
            </div>
          </div>
          <div className={classes.extraDetailsFormControl}>
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={extraFormData.bio}
              onChange={handleInput}
            ></textarea>
            <p className={classes.charLimit}>
              {150 - extraFormData.bio.length} characters remaining
            </p>
          </div>
          <div className={classes.extraDetailsFormControl}>
            <label htmlFor="bio">Gender</label>
            <select
              className={classes.gender}
              name="gender"
              onChange={handleInput}
            >
              <option value="Prefer not to say">Prefer not to say</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Transgender">Transgender</option>
              <option value="Non-Binary">Non-Binary</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {/* <div>
            <label></label>
            <input />
          </div> */}
          <div className={classes.btnGroup}>
            <button
              type="button"
              className={classes.submitBtn}
              onClick={submitHandler}
              disabled={
                extraFormData.firstName === "" || extraFormData.lastName === ""
              }
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExtraSignupDetails;
