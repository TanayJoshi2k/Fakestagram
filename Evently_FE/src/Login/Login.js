import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import classes from "./Login.module.css";

function Login(props) {
  const [userDetails, setUserDetails] = useState({});
  const [formError, setFormError] = useState("");
  const [rateError, setRateError] = useState("");

  const inputHandler = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };

  const loginSubmitHandler = (e) => {
    e.preventDefault();
    axios
      .post("login", userDetails)
      .then((res) => {
        setFormError("");
        props.setIsAuth(true);
        props.setUsername(res.data.message.username);
      })
      .catch((e) => {
        console.log(e);
        props.setIsAuth(false);
        if (e.response.data.status === 429) {
          setRateError(e.response.data.error);
        }
        setFormError(e.response.data.error.error_message);
      });
  };

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
              <button type="submit" onClick={loginSubmitHandler}>
                SUBMIT
              </button>
            </div>
            <p className={classes.signupLink}>
              Don't have an account? <Link to="/signup">Create one</Link>
            </p>
            {rateError ? (
              <p className={classes.rateError}>{rateError}</p>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
