import React from "react";
import { NavLink } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDolly } from "@fortawesome/free-solid-svg-icons";

const NoData = (props) => {
  return (
    <div className="flex flex-col mx-auto size-full">
      <div className="text-center py-24 px-4 sm:px-6 lg:px-8">
        <h1 className="block text-7xl font-bold text-color-1 sm:text-9xl dark:text-color-1">
          {props.icon === undefined ? (
            <>
              <FontAwesomeIcon icon={faDolly} />
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={props.icon} />
            </>
          )}
        </h1>
        <p className="mt-3 text-color-5 dark:text-color-5">
          {`Wah data ${props.name} belum ada nih...`}
        </p>
        <p className="text-color-5 dark:text-color-5">
          Silahkan tambahkan data terlebih dahulu.
        </p>
        <div className="mt-5 flex flex-col justify-center items-center gap-2 sm:flex-row sm:gap-3">
          <button
            type="button"
            data-hs-overlay="#hs-tambah-alert"
            className="w-full sm:w-auto py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-color-1 text-white hover:bg-color-1 disabled:opacity-50 disabled:pointer-events-none"
          >
            + {`Tambah ${props.name}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoData;
