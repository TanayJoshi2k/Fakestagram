import axios from "axios";
import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./Home/Home";
import Login from "./Login/Login";
import Signup from "./Signup/Signup";
import EmailVerify from "./EmailVerify/EmailVerify";
import ExtraSignupDetails from "./ExtraSignupDetails/ExtraSignupDetails";
import AccountPage from "./AccountPage/AccountPage";
import "./App.css";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    axios
      .get("/isAuth")
      .then((res) => {
        setIsAuth(true);
        setUserDetails(res.data.message);
      })
      .catch((e) => {
        setIsAuth(false);
      });
  }, []);

  return (
    <Routes>
      <Route
        path="/account/:username"
        element={
          isAuth ? (
            <AccountPage
              setIsAuth={setIsAuth}
              username={userDetails.username}
            />
          ) : (
            <Navigate to="/" />
          )
        }
      ></Route>
      <Route
        path="/"
        element={
          isAuth ? (
            <Navigate to="/home" />
          ) : (
            <Login setIsAuth={setIsAuth} setUserDetails={setUserDetails} />
          )
        }
      ></Route>
      <Route
        path="/home"
        element={
          !isAuth ? (
            <Navigate to="/" />
          ) : (
            <Home
              setIsAuth={setIsAuth}
              username={userDetails.username}
              userDetails={userDetails}
            />
          )
        }
      ></Route>

      <Route path="/signup" element={<Signup setIsAuth={setIsAuth} />}></Route>
      <Route
        path="/users/:user_id/verify/:token"
        element={<EmailVerify setIsAuth={setIsAuth} />}
      ></Route>
      <Route
        path="/extra-details"
        element={
          !isAuth ? (
            <Navigate to="/" />
          ) : (
            <ExtraSignupDetails
              setIsAuth={setIsAuth}
              username={userDetails.username}
            />
          )
        }
      ></Route>
    </Routes>
  );
}

export default App;
