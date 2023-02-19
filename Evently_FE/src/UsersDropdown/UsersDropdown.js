import React, {useState, useEffect} from "react";
import classes from "./UsersDropdown.module.css";

function UsersDropdown(props) {

    return <div className={classes.dropdownContainer}>
        {props.users.map((user)=>{
            return <div key={user._id}>
                <p>{user.username}</p>
            </div>
        })}
    </div>
}

export default UsersDropdown;