import React from "react";

function Heart(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width}
      height={props.height}
      fill={props.fillColor}
      className="bi bi-heart-fill"
      viewBox="0 0 16 16"
      style={{marginTop:"4px"}}
    >
      <path
        fillRule="evenodd"
        d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
      />
    </svg>
  );
}

export default Heart;
