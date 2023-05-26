import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { saveUserDetails } from "./redux/actions/userActions";
import Home from "./Home/Home";
import Post from "./Post/Post";
import Login from "./Login/Login";
import Signup from "./Signup/Signup";
import EmailVerify from "./EmailVerify/EmailVerify";
import ExtraSignupDetails from "./ExtraSignupDetails/ExtraSignupDetails";
import AccountPage from "./AccountPage/AccountPage";
import { AnimatePresence } from "framer-motion";

import "./App.css";

function App() {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    axios
      .get("/isAuth")
      .then((res) => {
        dispatch(saveUserDetails(res.data.message));
      })
      .catch((e) => {
        dispatch(saveUserDetails({}));
      });
  }, []);
  return (
    <AnimatePresence initial={false} mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/account/:username"
          element={
            state.userReducer.authorized ? <AccountPage /> : <Navigate to="/" />
          }
        ></Route>
        <Route
          path="/"
          element={
            state.userReducer.authorized ? <Navigate to="/home" /> : <Login />
          }
        ></Route>
        <Route
          path="/home"
          element={
            !state.userReducer.authorized ? <Navigate to="/" /> : <Home />
          }
        ></Route>

        <Route path="/signup" element={<Signup />}></Route>
        <Route
          path="/users/:user_id/verify/:token"
          element={<EmailVerify />}
        ></Route>
        <Route
          path="/extra-details"
          element={
            !state.userReducer.authorized ? (
              <Navigate to="/" />
            ) : (
              <ExtraSignupDetails />
            )
          }
        ></Route>
        <Route
          path="/posts/:postId"
          element={
            state.userReducer.authorized ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Post
                  key={state.userReducer.viewPost?._id}
                  usernameswholiked={
                    state.userReducer.viewPost?.usernameswhoLiked
                  }
                  postData={state.userReducer.viewPost}
                  isLiked={state.userReducer.likedPosts?.includes(
                    state.userReducer.viewPost?._id
                  )}
                  isSaved={state.userReducer.savedPosts?.includes(
                    state.userReducer.viewPost?._id
                  )}
                />
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        ></Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
