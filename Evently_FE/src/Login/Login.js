import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { saveUserDetails } from "../redux/actions/userActions";
import { Link } from "react-router-dom";
import ExtraSignupDetails from "../ExtraSignupDetails/ExtraSignupDetails";
import HomePhones from "../Assets/home_phones_2x.webp";
import PhoneDisplay from "../Assets/screenshot1_2x.webp";
import PhoneDisplayAlternate from "../Assets/screenshot4_2x.webp";

import axios from "axios";
import classes from "./Login.module.css";

function Login(props) {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  const [loginDetails, setLoginDetails] = useState({
    username: "",
    password: "",
  });

  const [formError, setFormError] = useState("");
  const [rateError, setRateError] = useState("");
  const [userVerifiedError, setUserVerifiedError] = useState("");
  const [confirmedDetails, setConfirmedDetails] = useState("");
  const [displayImage, setDisplayImage] = useState(PhoneDisplay);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayImage(
        displayImage === PhoneDisplay ? PhoneDisplayAlternate : PhoneDisplay
      );
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [displayImage]);

  const inputHandler = (e) => {
    setLoginDetails({
      ...loginDetails,
      [e.target.name]: e.target.value,
    });
  };

  const loginSubmitHandler = (e) => {
    e.preventDefault();
    axios
      .post("/login", loginDetails)
      .then((res) => {
        setFormError("");
        dispatch(saveUserDetails(res.data.message));
      })
      .catch((e) => {
        console.log(e.response.data)
        setFormError(e.response.data.error?.error_message);
        if (e.response.data.status === 429) {
          setRateError(e.response.data.error);
        }
        setUserVerifiedError(e.response.data.message);
        setConfirmedDetails(e.response.data.confirmedDetails);
      });
  };

  if (confirmedDetails === false) {
    return <ExtraSignupDetails username={loginDetails.username} />;
  }

  return (
    <div className={classes.loginContainer}>
      <div className={classes.imgContainer}>
        <img src={HomePhones} />
        <div>
          <img src={displayImage} />
        </div>
      </div>
      <div className={classes.loginFormContainer}>
        <div className={classes.loginForm}>
          <h1>Instagram</h1>
          <form>
            <div className={classes.inputControlGroup}>
              <div className={classes.inputControl}>
                <input
                  disabled={rateError}
                  type="text"
                  placeholder="Username"
                  name="username"
                  onChange={inputHandler}
                />
              </div>
              <div className={classes.inputControl}>
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
                  !loginDetails.username || loginDetails.password.length < 6
                }
              >
                Log in
              </button>
            </div>

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
          <p className={classes.hr}>OR</p>
          <p className={classes.fbLink}>Login with Facebook</p>

        </div>
        <p className={classes.signupLink}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
