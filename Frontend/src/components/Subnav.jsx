import React from "react";

const Subnav = (props) => {
  return (
    <div>
      <p className={`mb-2 ${props.color} font-normal`}>{props.subnav}</p>
    </div>
  );
};

export default Subnav;
