import React from "react";

const Topbar = () => {
  return (
    <>
      <div className="absolute z-0 bg-color-1">
        <div className="relative h-32 w-32">
          <div className="absolute top-0 right-0 h-16 w-16">
            <p>Administrator</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Topbar;
