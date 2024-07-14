import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCubes,
  faCircleExclamation,
  faMoneyBillTrendUp,
} from "@fortawesome/free-solid-svg-icons";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);
import Zoom from "react-medium-image-zoom";
import Subnav from "../../components/Subnav";
import MainTitle from "../../components/MainTitle";
import Pagination from "../../components/Pagination/Pagination";
import NoData from "../../components/NoData";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  const [barang, setBarang] = useState([]);
  const [terendah, setTerendah] = useState([]);
  const [pemasukan, setPemasukan] = useState([]);

  const getBarang = async () => {
    const response = await axios.get("http://localhost:1023/api/v1/barang");
    setBarang(response.data.data);
    setTerendah(response.data.terendah);
    setLoading(false);
  };

  const getPemasukan = async () => {
    const response = await axios.get("http://localhost:1023/api/v1/pemasukan");
    setPemasukan(response.data.data);
    setLoading(false);
  };

  pemasukan.forEach((data) => {
    data.tgl = new Date(data.tgl);
  });

  const currentDate = new Date();
  const targetMonth = currentDate.getMonth();
  const targetYear = currentDate.getYear();
  const filteredData = pemasukan.filter((data) => {
    const dataMonth = data.tgl.getMonth(); // Bulan data (0-based index)
    const dataYear = data.tgl.getYear(); // Bulan data (0-based index)
    return dataMonth === targetMonth && dataYear === targetYear;
  });

  const total = filteredData.reduce((acc, curr) => acc + curr.pemasukan, 0);

  useEffect(() => {
    getBarang();
    getPemasukan();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 4;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = terendah.slice(firstIndex, lastIndex);
  const npage = Math.ceil(terendah.length / recordsPerPage);

  // Diagram
  const backgroundColor = [
    "rgba(255, 99, 132, 0.9)",
    "rgba(54, 162, 235, 0.9)",
    "rgba(255, 206, 86, 0.9)",
    "rgba(75, 192, 192, 0.9)",
    "rgba(153, 102, 255, 0.9)",
  ];
  const borderColor = [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
  ];

  const toIDR = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <>
      <Navbar active3="active" />
      <div className="w-full pt-10 px-4 sm:px-6 md:px-8 lg:ps-72">
        <MainTitle size="text-3xl" main="Dashboard" />
        <Subnav color=" text-color-5" subnav="Dashboard" />

        {/* Content */}
        <div className="px-4 py-10 sm:px-6 lg:px-0 lg:py-5 ">
          {/* 3 Card info */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-6">
            <div
              className="group flex flex-col bg-white shadow-md rounded-xl hover:shadow-md transition dark:bg-color-6 dark:border-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              href="#"
            >
              <div className="p-4 md:p-5">
                <div className="flex justify-between items-center">
                  <div className="text-5xl text-color-6 bg-sky-400  p-4 rounded-full">
                    <FontAwesomeIcon icon={faCubes} />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-xl text-gray-800 dark:text-color-5">
                      Total barang
                    </h3>
                    <p className="text-5xl font-semibold text-color-5">
                      {barang.length}{" "}
                      <span className="text-sm font-normal text-gray-500">
                        Barang
                      </span>
                    </p>
                  </div>
                  <div className="ps-3"></div>
                </div>
              </div>
            </div>

            <div
              className="group flex flex-col bg-white shadow-md rounded-xl hover:shadow-md transition dark:bg-color-6 dark:border-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              href="#"
            >
              <div className="p-4 md:p-5">
                <div className="flex justify-between items-center">
                  <div className="text-5xl text-color-6 bg-yellow-400 p-4 rounded-full">
                    <FontAwesomeIcon icon={faCircleExclamation} />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-xl text-gray-800 dark:text-color-5">
                      Perlu Restock
                    </h3>
                    <p className="text-5xl font-semibold text-color-5">
                      {barang.filter((item) => item.jml_stok <= 7).length}{" "}
                      <span className="text-sm font-normal text-gray-500">
                        Barang
                      </span>
                    </p>
                  </div>
                  <div className="ps-3"></div>
                </div>
              </div>
            </div>

            <div
              className="group flex flex-col bg-white shadow-md rounded-xl hover:shadow-md transition dark:bg-color-6 dark:border-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              href="#"
            >
              <div className="p-4 md:p-5">
                <div className="flex justify-between items-center">
                  <div className="text-5xl text-color-6 bg-green-400 p-4 rounded-full">
                    <FontAwesomeIcon icon={faMoneyBillTrendUp} />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-xl text-gray-800 dark:text-color-5">
                      Pemasukan Bulanan
                    </h3>
                    <p className="text-3xl font-semibold text-color-5">
                      {toIDR.format(total)}
                    </p>
                  </div>
                  <div className="ps-3"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-6">
            <div className="group flex flex-col bg-white shadow-md rounded-xl hover:shadow-md transition dark:bg-color-6 col-span-2 ">
              <div className="p-4 md:p-5">
                <MainTitle size="text-xl" main="Produk dengan Stok Terendah" />
                <Subnav
                  subnav="Daftar list produk dengan stok paling rendah akan ditampilkan
                  disini"
                  color="text-color-4"
                />

                <div className="flex flex-col mt-5">
                  <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                      <div className="border rounded-lg">
                        {loading === true ? (
                          <>
                            <div className="w-full py-28">
                              <div className="flex justify-center animate-pulse">
                                <img
                                  src="./src/assets/loading.webp"
                                  style={{ width: "50%" }}
                                  alt=""
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            {records != 0 ? (
                              <>
                                <div className="overflow-hidden">
                                  <table className="min-w-full divide-y ">
                                    <thead className=" dark:bg-color-6">
                                      <tr>
                                        <th
                                          scope="col"
                                          className="px-6 py-3 text-center text-sm font-bold text-color-5 uppercase"
                                        >
                                          No
                                        </th>
                                        <th
                                          scope="col"
                                          className="px-6 py-3 text-start text-sm font-bold text-color-5 uppercase"
                                        >
                                          Nama Barang
                                        </th>
                                        <th
                                          scope="col"
                                          className="px-6 py-3 text-center text-sm font-boldtext-color-5 uppercase"
                                        >
                                          Stok
                                        </th>
                                        <th
                                          scope="col"
                                          className="px-6 py-3 text-center text-sm font-boldtext-color-5 uppercase"
                                        >
                                          Gambar
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                      {records.map((item, index) => (
                                        <tr
                                          key={index}
                                          className="text-center "
                                        >
                                          <td className="py-4 whitespace-nowrap text-sm font-medium text-color-5">
                                            {index +
                                              1 +
                                              (currentPage - 1) *
                                                recordsPerPage}
                                            .
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5 text-start">
                                            {item.n_barang}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-color-5">
                                            {item.jml_stok} -/{item.tipe_stok}
                                          </td>
                                          <td className="flex justify-center items-center px-6 py-4 whitespace-nowrap text-sm ">
                                            <Zoom>
                                              <img
                                                className="w-20 p-1 rounded-s-md border border-color-2 disabled:opacity-50 disabled:pointer-events-none dark:bg-color-2 dark:text-gray-400 dark:focus:ring-color-2"
                                                src={
                                                  item.img
                                                    ? item.img
                                                    : "./src/assets/no-preview.png"
                                                }
                                              />
                                            </Zoom>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                <Pagination
                                  currentPage={currentPage}
                                  setCurrentPage={setCurrentPage}
                                  npage={npage}
                                  data={
                                    barang.filter((item) => item.jml_stok <= 7)
                                      .length
                                  }
                                  show={records.length}
                                  setName={"Barang"}
                                />
                              </>
                            ) : (
                              <>
                                <NoData name={"Barang"} />
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Diagram Pie */}
            <div
              className="group flex flex-col bg-white shadow-md rounded-xl hover:shadow-md transition dark:bg-color-6 dark:border-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              href="#"
            >
              <div className="p-4 md:p-5">
                <MainTitle size="text-xl" main="Produk Terbanyak" />
                <Subnav
                  subnav="Produk dengan stok paling banyak"
                  color="text-color-4"
                />
              </div>
              {/* Diagram */}
              {loading === true ? (
                <>
                  <div className="w-full py-28">
                    <div className="flex justify-center animate-pulse">
                      <img
                        src="./src/assets/loading.webp"
                        style={{ width: "50%" }}
                        alt=""
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-center items-center">
                    <Pie
                      data={{
                        labels: barang
                          .filter((item) => item.jml_stok)
                          .splice(0, 4)
                          .map((item) => item.n_barang),
                        datasets: [
                          {
                            label: "stok",
                            data: barang
                              .filter((item) => item.jml_stok)
                              .splice(0, 4)
                              .map((item) => item.jml_stok),
                            backgroundColor: backgroundColor,
                            borderColor: borderColor,
                            borderWidth: 1,
                          },
                        ],
                      }}
                    />
                  </div>
                  <div className="p-4 md:p-5 font-normal text-sm capitalize ">
                    <p className="font-bold">Jumlah:</p>
                    <div className="flex flex-wrap -mx-4">
                      {barang
                        .filter((item) => item.jml_stok)
                        .splice(0, 4)
                        .map((item, index) => (
                          <div
                            className="flex items-center ml-5 my-2"
                            key={index}
                          >
                            <div
                              className="p-3"
                              style={{
                                background:
                                  backgroundColor[
                                    index % backgroundColor.length
                                  ],
                              }}
                            ></div>
                            <p className="ml-2">
                              {item.n_barang}: {item.jml_stok}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
