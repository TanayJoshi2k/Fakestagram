import React, { useState, useEffect } from "react";
import classes from "./Signup.module.css";
import { Link } from "react-router-dom";
import HomePhones from "../Assets/home_phones_2x.webp";
import PhoneDisplay from "../Assets/screenshot1_2x.webp";
import PhoneDisplayAlternate from "../Assets/screenshot4_2x.webp";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import axios from "axios";

function Signup() {
  const form = useForm();
  const { register, control, handleSubmit, formState } = form;

  const { errors, isDirty, isValid } = formState;
  const [emailVerificationMsg, setEmailVerificationMsg] = useState("");
  const [displayImage, setDisplayImage] = useState(PhoneDisplay);
  const [formErrors, setFormErrors] = useState({
    emailError: "",
    usernameError: "",
    passwordError: "",
  });
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

  const signupHandler = (data, e) => {
    e.preventDefault();
    axios
      .post("/signup", data)
      .then((res) => {
        setEmailVerificationMsg(res.data.message);
      })
      .catch((e) => {
        setFormErrors({
          emailError: e.response.data.error?.emailError,
          usernameError: e.response.data.error?.usernameError,
          passwordError: e.response.data.error?.passwordError,
        });
      });
  };

  return (
    <div className={classes.signupContainer}>
      <div className={classes.imgContainer}>
        <img src={HomePhones} />
        <div>
          <img src={displayImage} />
        </div>
      </div>
      <div className={classes.signupFormContainer}>
        <div className={classes.signupForm}>
          <form onSubmit={handleSubmit(signupHandler)} noValidate>
            <div className={classes.inputControlGroup}>
              <div className={classes.inputControl}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  id="email"
                  {...register("email", {
                    pattern: {
                      value:
                        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                      message: "Invalid email format",
                    },
                    required: "Email cannot be empty",
                  })}
                />

                <p className={classes.signupFormErrors}>
                  {errors.email?.message || formErrors.emailError}
                </p>
              </div>
              <div className={classes.inputControl}>
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  id="username"
                  {...register("username", {
                    required: "Username cannot be empty",
                  })}
                />
                <p className={classes.signupFormErrors}>
                  {errors.username?.message || formErrors.usernameError}
                </p>
              </div>
              <div className={classes.inputControl}>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  id="password"
                  {...register("password", {
                    required: "Password cannot be empty",
                  })}
                />
                <p className={classes.signupFormErrors}>
                  {errors.password?.message || formErrors.passwordError}
                </p>
              </div>

              <button type="submit">SUBMIT</button>
              {emailVerificationMsg ? (
                <p className={classes.emailVerification}>
                  {emailVerificationMsg}
                </p>
              ) : null}
            </div>
          </form>

       
        </div>
        <p className={classes.signupLink}>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
