import react from "react";
import classes from "./Progressbar.module.css";

function ProgressBar(props) {
  const { progress } = props;

  const fillerStyles = {
    height: '100%',
    width: `${progress}%`,
    backgroundColor: "#00B2FF",
    borderRadius: 'inherit',
    textAlign:"center"
  }

  return (
    (progress > 0 ?<div className={classes.containerStyles}>
      <div style={fillerStyles}>
        <span
          className={classes.labelStyles}
        >{`${progress}%`}</span>
      </div>
    </div>:null)
  );
}

export default ProgressBar;
