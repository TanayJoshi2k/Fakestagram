import React, { useState } from "react";
import classes from "./Signup.module.css";
import { Link } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [signupDetails, setSignupDetails] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [emailVerificationMsg, setEmailVerificationMsg] = useState("");
  const [signupFormErrors, setSignupFormErrors] = useState({
    usernameError: "",
    passwordError: "",
    emailError: "",
  });

  const inputHandler = (e) => {
    setSignupDetails({
      ...signupDetails,
      [e.target.name]: e.target.value,
    });
  };

  const signupHandler = (e) => {
    e.preventDefault();
    axios
      .post("/signup", signupDetails)
      .then((res) => {
        setEmailVerificationMsg(res.data.message);
      })
      .catch((e) => {
        setSignupFormErrors({
          usernameError: e.response.data.error.usernameError,
          passwordError: e.response.data.error.passwordError,
        });
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
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  onChange={inputHandler}
                />
              </div>
              <div className={classes.inputControl}>
                <label>Username</label>
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  onChange={inputHandler}
                />
                {signupFormErrors.usernameError ? (
                  <p className={classes.signupFormErrors}>
                    {signupFormErrors.usernameError}
                  </p>
                ) : null}
              </div>
              <div className={classes.inputControl}>
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={inputHandler}
                />
                {signupFormErrors.passwordError ? (
                  <p className={classes.signupFormErrors}>
                    {signupFormErrors.passwordError}
                  </p>
                ) : null}
              </div>

              <button type="submit" onClick={signupHandler}>
                SUBMIT
              </button>
              {emailVerificationMsg ? (
                <p className={classes.emailVerification}>
                  {emailVerificationMsg}
                </p>
              ) : null}
            </div>
            <p className={classes.signupLink}>
              Already have an account? <Link to="/">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
