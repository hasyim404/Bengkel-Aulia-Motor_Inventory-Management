import React from "react";

const Pagination = ({
  currentPage,
  setCurrentPage,
  npage,
  show,
  data,
  setName,
}) => {
  const prePage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const changeCPage = (id) => {
    setCurrentPage(id);
  };

  const nextPage = () => {
    if (currentPage < npage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const numbers = [...Array(npage + 1).keys()].slice(1);

  return (
    <>
      <div className=" py-1 px-8">
        <nav className="flex items-center justify-start space-x-1">
          <button
            type="button"
            onClick={prePage}
            disabled={currentPage === 1}
            className="p-2.5 inline-flex bg-color-2 items-center gap-x-2 text-sm rounded-full text-color-5 hover:text-color-6 disabled:opacity-50 disabled:pointer-events-none dark:text-color-5 dark:hover:bg-color-1 "
          >
            <span aria-hidden="true">«</span>
            <span className="sr-only">Previous</span>
          </button>
          {numbers.map((n, i) => (
            <button
              key={i}
              className={`min-w-[40px] flex justify-center items-center ${
                currentPage === n
                  ? "bg-color-1 text-color-6"
                  : "bg-color-2 text-color-4 dark:hover:bg-color-1 dark:hover:text-color-6"
              } py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none`}
              aria-current="page"
              onClick={() => changeCPage(n)}
            >
              {n}
            </button>
          ))}

          <button
            type="button"
            onClick={nextPage}
            disabled={currentPage === npage}
            className="p-2.5 inline-flex bg-color-2 items-center gap-x-2 text-sm rounded-full text-color-5 hover:text-color-6 disabled:opacity-50 disabled:pointer-events-none dark:text-color-5 dark:hover:bg-color-1 "
          >
            <span className="sr-only">Next</span>
            <span aria-hidden="true">»</span>
          </button>
          <div className="">
            <p className="text-end italic">
              Menampilkan{" "}
              <span className="underline font-semibold">{show}</span> dari{" "}
              <span className="underline font-semibold">{data}</span> total{" "}
              {setName}.
            </p>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Pagination;
