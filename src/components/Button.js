import React from "react";

function Button({ children, type = "button", onClick = () => {}, ...props }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${props.className && props.className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
