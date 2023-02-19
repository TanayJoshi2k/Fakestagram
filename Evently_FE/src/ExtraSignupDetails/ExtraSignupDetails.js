import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import classes from "./ExtraSignupDetails.module.css";

function ExtraSignupDetails(props) {
  // const [imgUrl, setImgUrl] = useState("");
  const bioRegex = /[^a-z A-Z0-9@_.!-#*]*$/i;
  const nameRegex = /[^a-z A-Z]*$/i;

  const [extraFormData, setExtraFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    gender: "",
    username: props.username
  });

  const MAX_CHARS = 150;
  const navigate = useNavigate();

  const handleInput = (e) => {
    const name = e.target.name;
    let value = "";

    if (name === "bio") {
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
    axios
      .post("/secondSignupStep", extraFormData)
      .then((res) => {
        props.setIsAuth(true);
        navigate("/home", {state:{username: props.username}});
      })
      .catch((e) => console.log(e));
  };

  return (
    <div className={classes.extraDetailsContainer}>
      <div className={classes.heroContainer}>
        <h1>Almost there.</h1>
        <h1 className={classes.hero}>Let others know you better!</h1>
      </div>

      <div>
        <label htmlFor="profilePic" className={classes.profilePicLabel}></label>
        <input
          id="profilePic"
          type="file"
          accept="image/png, image/jpg, image/jpeg"
          style={{ display: "none" }}
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
