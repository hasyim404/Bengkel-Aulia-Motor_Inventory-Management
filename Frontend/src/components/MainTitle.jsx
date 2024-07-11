import React from "react";

const MainTitle = (props) => {
  return (
    <div>
      <h1 className={`block ${props.size} font-bold`}>{props.main}</h1>
    </div>
  );
};

export default MainTitle;
