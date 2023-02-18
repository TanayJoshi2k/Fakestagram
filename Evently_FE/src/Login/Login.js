import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ExtraSignupDetails from "../ExtraSignupDetails/ExtraSignupDetails";
import axios from "axios";
import classes from "./Login.module.css";

function Login(props) {
  const [userDetails, setUserDetails] = useState({
    username: "",
    password: "",
  });
  const [formError, setFormError] = useState("");
  const [rateError, setRateError] = useState("");
  const [userVerifiedError, setUserVerifiedError] = useState("");
  const [confirmedDetails, setConfirmedDetails] = useState("");

  const inputHandler = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };

  const loginSubmitHandler = (e) => {
    e.preventDefault();
    axios
      .post("/login", userDetails)
      .then((res) => {
        setFormError("");
        props.setIsAuth(true);
        props.setUsername(res.data.message.username);
      })
      .catch((e) => {
        setFormError(e.response.data.error?.error_message);
        props.setIsAuth(false);
        if (e.response.data.status === 429) {
          setRateError(e.response.data.error);
        }
        setUserVerifiedError(e.response.data.message);
        setConfirmedDetails(e.response.data.confirmedDetails);

      });
  }

  if (confirmedDetails === false) {
    return (
      <ExtraSignupDetails
        username={userDetails.username}
        setIsAuth={props.setIsAuth}
      />
    );
  }

  return (
    <div className={classes.loginContainer}>
      <div className={classes.imgContainer}>
        <h1>Evently.</h1>
      </div>
      <div className={classes.loginFormContainer}>
        <div className={classes.loginForm}>
          <form>
            <div className={classes.inputControlGroup}>
              <div className={classes.inputControl}>
                <label>Username</label>
                <input
                  disabled={rateError}
                  type="text"
                  placeholder="Username"
                  name="username"
                  onChange={inputHandler}
                />
              </div>
              <div className={classes.inputControl}>
                <label>Password</label>
                <input
                  disabled={rateError}
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={inputHandler}
                />
              </div>
              {formError ? (
                <p className={classes.formError}>{formError}</p>
              ) : null}
              <button
                type="submit"
                onClick={loginSubmitHandler}
                disabled={
                  !userDetails.username || userDetails.password.length < 6
                }
              >
                SUBMIT
              </button>
            </div>
            <p className={classes.signupLink}>
              Don't have an account? <Link to="/signup">Create one</Link>
            </p>
            {rateError ? (
              <p className={classes.rateError}>{rateError}</p>
            ) : null}
            {userVerifiedError ? (
              <p className={classes.rateError}>{userVerifiedError}</p>
            ) : null}
            {/* {formError ? (
              <p className={classes.rateError}>{formError}</p>
            ) : null} */}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
