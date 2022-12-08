import React, { useState, useEffect } from "react";
import axios from "axios";

import classes from "./Login.module.css";

function Login(props) {
  const [userDetails, setUserDetails] = useState({});
  const [formError, setFormError] = useState("")

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
      })
      .catch((e) => {
        props.setIsAuth(false);

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
                  type="text"
                  placeholder="Username"
                  name="username"
                  onChange={inputHandler}
                />
              </div>
              <div className={classes.inputControl}>
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={inputHandler}
                />
              </div>
              {formError ? <p className={classes.formError}>{formError}</p> : null}
              <button type="submit" onClick={loginSubmitHandler}>
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
