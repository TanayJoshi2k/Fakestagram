import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import TokenError from "./TokenError";
import classes from "./EmailVerify.module.css";

function EmailVerify(props) {
  const [validURL, setValidURL] = useState(false);
  const params = useParams();
  const url = `http://localhost:3000/users/${params.user_id}/verify/${params.token}`;

  useEffect(() => {
    axios
      .get(url)
      .then((data) => {
        setValidURL(true);
      })
      .catch((e) => {
        setValidURL(false);
      });
  }, [url]);

  return (
    <div>
      {validURL ? (
        <div>
          <h1>Email verified!</h1>
          <Link to="/">
            <button className={classes.loginBtn}>Login</button>
          </Link>
        </div>
      ) : (
        <TokenError />
      )}
    </div>
  );
}

export default EmailVerify;
