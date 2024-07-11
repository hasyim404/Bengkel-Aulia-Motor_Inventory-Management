import React from "react";
import Navbar from "../../components/Navbar/Navbar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCubes,
  faCircleExclamation,
  faMoneyBillTrendUp,
} from "@fortawesome/free-solid-svg-icons";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);
import ModalImage from "react-modal-image";
import Subnav from "../../components/Subnav";
import MainTitle from "../../components/MainTitle";

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="w-full pt-10 px-4 sm:px-6 md:px-8 lg:ps-72">
        <MainTitle size="text-3xl" main="Laporan keuangan" />
        <Subnav color=" text-color-5" subnav="Pemasukan" />

        {/* Table */}
        <div className="px-4 py-10 sm:px-6 lg:px-0 lg:py-5 ">
          <div className="group flex flex-col bg-white shadow-md rounded-xl hover:shadow-md transition dark:bg-color-6 col-span-2 ">
            <div className="p-4 md:p-5">
              <MainTitle size="text-xl" main="Pemasukan" />

              <div className="flex flex-col mt-5">
                <div className="-m-1.5 overflow-x-auto">
                  <div className="p-1.5 min-w-full inline-block align-middle">
                    <div className="border rounded-lg">
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
                                Tgl Transaksi
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-center text-sm font-boldtext-color-5 uppercase"
                              >
                                Keterangan
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-center text-sm font-boldtext-color-5 uppercase"
                              >
                                Nominal
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-center text-sm font-boldtext-color-5 uppercase"
                              ></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            <tr>
                              <td className="px-6 text-center py-4 whitespace-nowrap text-sm font-medium text-color-5">
                                1.
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5">
                                27-11-2023
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-color-5">
                                Case Handphone Transparan
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-color-5">
                                Rp.30.000
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 text-center py-4 whitespace-nowrap text-sm font-medium text-color-5">
                                2.
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5">
                                28-11-2023
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-color-5">
                                Powerbank Robot
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-color-5">
                                Rp.150.000
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 text-center py-4 whitespace-nowrap text-sm font-medium text-color-5">
                                3.
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5">
                                29-11-2023
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-color-5">
                                Samsung Buds pro
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-color-5">
                                Rp.400.000
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 text-center py-4 whitespace-nowrap text-sm font-medium text-color-5">
                                4.
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5">
                                30-11-2023
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-color-5">
                                Kabel Charger USB-A to USB-C
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-color-5">
                                Rp.60.000
                              </td>
                            </tr>
                            <tr>
                              <td className="px-6 text-center py-4 whitespace-nowrap text-sm font-medium text-color-5">
                                5.
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5">
                                01-12-2023
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-color-5">
                                Voucher Telkomsel 7GB 30hari
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-color-5">
                                Rp.60.000
                              </td>
                            </tr>
                            {/* Modals Img */}
                            <tr>
                              <td>
                                <div
                                  id="hs-sign-out-alert-small-window"
                                  className="hs-overlay hidden w-full h-full fixed top-0 start-0 z-[70] overflow-x-hidden overflow-y-auto"
                                >
                                  <div className="hs-overlay-open:mt-40 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-xs sm:w-full m-3 sm:mx-auto">
                                    <div className="relative flex flex-col dark:bg-color-3 shadow-md rounded-xl">
                                      <div className="absolute top-2 end-2">
                                        <button
                                          type="button"
                                          className="flex justify-center items-center w-7 h-7 text-sm font-semibold rounded-lg border border-transparent text-color-5 hover:bg-color-1 disabled:opacity-50 disabled:pointer-events-none dark:color-5 dark:border-transparent hover:text-color-6 dark:hover:bg-color-1 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                                          data-hs-overlay="#hs-sign-out-alert-small-window"
                                        >
                                          <span className="sr-only">Close</span>
                                          <svg
                                            className="flex-shrink-0 w-4 h-4"
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
                                            <path d="M18 6 6 18" />
                                            <path d="m6 6 12 12" />
                                          </svg>
                                        </button>
                                      </div>

                                      <div className="p-4 sm:p-10 text-center overflow-y-auto">
                                        <div className="mt-6 grid gap-y-2">
                                          <ModalImage
                                            className="w-20 p-1 rounded-s-md border border-color-2 disabled:opacity-50 disabled:pointer-events-none dark:bg-color-2 dark:text-gray-400 dark:focus:ring-color-2"
                                            small={`./src/assets/no-preview.png`}
                                            medium={`./src/assets/no-preview.png`}
                                            hideDownload
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className=" py-1 px-8">
                        <nav className="flex items-center justify-start space-x-1">
                          <button
                            type="button"
                            className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-color-5 hover:text-color-6 disabled:opacity-50 disabled:pointer-events-none dark:text-color-5 dark:hover:bg-color-1 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                          >
                            <span aria-hidden="true">«</span>
                            <span className="sr-only">Previous</span>
                          </button>
                          <button
                            type="button"
                            className="min-w-[40px] flex justify-center items-center text-color-5 bg-color-1 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none text-color-6 dark:hover:bg-color-1"
                            aria-current="page"
                          >
                            1
                          </button>
                          <button
                            type="button"
                            className="min-w-[40px] flex justify-center items-center text-color-5 hover:bg-color-1 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none hover:text-color-6 dark:hover:bg-color-1"
                          >
                            2
                          </button>
                          <button
                            type="button"
                            className="min-w-[40px] flex justify-center items-center text-color-5 hover:bg-color-1 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none hover:text-color-6 dark:hover:bg-color-1"
                          >
                            3
                          </button>
                          <button
                            type="button"
                            className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-color-5 hover:text-color-6 disabled:opacity-50 disabled:pointer-events-none dark:text-color-5 dark:hover:bg-color-1 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                          >
                            <span className="sr-only">Next</span>
                            <span aria-hidden="true">»</span>
                          </button>

                          {/* <div className="">
                            <p className="text-end">
                              Lorem ipsum dolor sit amet.
                            </p>
                          </div> */}
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
