import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";

const Blank = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <>
      <Navbar />
      <div className="flex flex-col mx-auto size-full">
        <div className="text-center py-52 px-4 sm:px-6 lg:px-8">
          <h1 className="block text-7xl font-bold text-color-1 sm:text-9xl dark:text-color-1">
            404
          </h1>
          <p className="mt-3 text-color-5 dark:text-color-5">
            Oops, something went wrong.
          </p>
          <p className="text-color-5 dark:text-color-5">
            Sorry, we couldn't find your page.
          </p>
          <div className="mt-5 flex flex-col justify-center items-center gap-2 sm:flex-row sm:gap-3">
            <NavLink
              onClick={handleGoBack}
              className="w-full sm:w-auto py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-color-1 text-white hover:bg-color-1 disabled:opacity-50 disabled:pointer-events-none"
            >
              <svg
                className="flex-shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
                onClick={handleGoBack}
              </svg>
              Back to examples
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blank;
