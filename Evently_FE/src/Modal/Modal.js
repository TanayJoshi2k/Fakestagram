import React from "react";
import classes from "./Modal.module.css";
import { motion } from "framer-motion";

function Modal(props) {
  return (
    <motion.div className={classes.modalContainer}>
      <motion.div
      style={{
        width:`${props.width}`
      }}
        className={classes.modal}
        initial={{
          opacity: 0,
          scale: 0.75,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: {
            ease: "easeOut",
            duration: 0.15,
          },
        }}
        exit={{
          opacity: 0,
          scale: 0.75,
          transition: {
            ease: "easeIn",
            duration: 0.15,
          },
        }}
      >
        <div className={classes.modalRibbon}>
          <p>{props.title}</p>
          <button
            onClick={() => {
              props.closeModal(false);
            }}
            className={classes.closeBtn}
          ></button>
        </div>
        {props.children}
      </motion.div>
    </motion.div>
  );
}

export default Modal;
