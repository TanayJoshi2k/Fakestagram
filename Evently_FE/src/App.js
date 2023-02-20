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
  const [username, setUsername] = useState("");
  useEffect(() => {
    axios
      .get("/isAuth")
      .then((res) => {
        setIsAuth(res.data.message.authorized);
        setUsername(res.data.message.username);
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
          !isAuth ? (
            <Navigate to="/" />
          ) : (
            <AccountPage setIsAuth={setIsAuth} username={username} />
          )
        }
      ></Route>
      <Route
        path="/"
        element={
          isAuth ? (
            <Navigate to="/home" />
          ) : (
            <Login setIsAuth={setIsAuth} setUsername={setUsername} />
          )
        }
      ></Route>
      <Route
        path="/home"
        element={
          !isAuth ? (
            <Navigate to="/" />
          ) : (
            <Home setIsAuth={setIsAuth} username={username} />
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
            <ExtraSignupDetails setIsAuth={setIsAuth} username={username} />
          )
        }
      ></Route>
    </Routes>
  );
}

export default App;
