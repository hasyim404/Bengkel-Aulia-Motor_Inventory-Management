import React from "react";

const SearchBar = ({ setQuery, setName }) => {
  return (
    <>
      <div className="relative max-w-xs">
        <label className="sr-only">Search</label>
        <input
          type="text"
          onChange={(e) => setQuery(e.target.value.toLowerCase())}
          name="hs-table-with-pagination-search"
          className="py-2 px-3 ps-9 block w-full border border-color-1 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-color-1 disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-1"
          placeholder={`Cari ${setName}...`}
        />
        <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
          <svg
            className="h-4 w-4 text-gray-400"
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
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
