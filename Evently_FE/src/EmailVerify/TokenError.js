import React from "react";
import classes from "./TokenError.module.css";

function TokenError() {
  return (
    <div className={classes.tokenErrorContainer}>
      <h1>Oops! Token is expired :(</h1>
      <button>Regenerate token</button>
    </div>
  );
}

export default TokenError;
