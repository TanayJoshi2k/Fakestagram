import React from "react";
import {motion} from "framer-motion"
import classes from "./Toast.module.css";

function Toast(props) {
  return (
    <motion.div
    initial={{x:0,y:-50}}
    animate={{x:0,y:10}}
      className={
        props.isErrorMessage ? classes.errorToast : classes.successToast
      }
    >
      <h5><span className={classes.crossIcon}>✖</span>Error</h5>
      <h6>{props.children}</h6>
    </motion.div>
  );
}

export default Toast;
