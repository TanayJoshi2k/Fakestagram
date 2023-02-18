import React from "react";
import classes from "./Toast.module.css";

function Toast(props) {
    return <div className={classes.toastContainer} style={{...props.style}}>
        
        <h6>{props.children}</h6>
    </div>
}

export default Toast;