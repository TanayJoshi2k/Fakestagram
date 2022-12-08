import axios from "axios";
import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./Home/Home";
import Login from "./Login/Login";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    axios
      .get("/isAuth")
      .then((res) => {
        setIsAuth(res.data.message.authorized);
        setUsername(res.data.message.username)
      })
      .catch((e) => {
        setIsAuth(false);
      });
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuth ? <Navigate to="/home" /> : <Login setIsAuth={setIsAuth} />
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
    </Routes>
  );
}

export default App;
