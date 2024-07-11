import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrashCan,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

import Navbar from "../../components/Navbar/Navbar";
import Subnav from "../../components/Subnav";
import MainTitle from "../../components/MainTitle";

import { useUser } from "../../context/UserContext";

const Pemasukan = () => {
  const { checkRoleAndNavigate } = useUser();
  const navigate = useNavigate();

  const [pemasukan, setPemasukan] = useState([]);

  useEffect(() => {
    const allowed = checkRoleAndNavigate("pemilik", navigate);

    if (!allowed) {
      return;
    }

    getPemasukan();
  }, [navigate]);

  // Get all data
  const getPemasukan = async () => {
    const response = await axios.get("http://localhost:1023/api/v1/pemasukan");
    setPemasukan(response.data.data);
  };

  return (
    <>
      <Navbar active2="active" display2="block" />
      <div className="w-full pt-10 px-4 sm:px-6 md:px-8 lg:ps-72">
        <MainTitle size="text-3xl" main="Laporan Keuangan" />
        <p className="mb-2 text-md font-normal text-color-4">
          {" "}
          <Link className="text-color-4" to="/dashboard">
            Dashboard{" "}
          </Link>
          / <span className="text-color-5 italic">Laporan Keuangan </span>/
          <span className="xt-color-5 italic"> Pemasukan</span>
        </p>

        {/* Content */}
        <div className="px-4 py-10 sm:px-6 lg:px-0 lg:py-5 ">
          <div className="mt-6 ">
            <div className="flex flex-col bg-white shadow-md rounded-xl hover:shadow-md transition dark:bg-color-6 col-span-2 ">
              <div className="p-4 md:p-5">
                <div className="grid grid-flow-col gap-4 place-content-between">
                  <div className="col-span-3">
                    <MainTitle size="text-xl" main="Data Pemasukan" />
                    <Subnav
                      subnav="Berisi daftar dari seluruh pemasukan barang yang terjual"
                      color="text-color-4"
                    />
                  </div>
                  <div className="col-span-7 flex justify-end">
                    <div className="py-1 px-2">
                      <p className="font-semibold underline underline-offset-4">
                        01 Des 2023 - 31 Des 2023
                      </p>
                      <p className="font-semibold">
                        Total Pemasukan:{" "}
                        <span className="font-normal text-color-4">
                          Rp. 1.673.000
                        </span>
                      </p>
                    </div>

                    <div className="py-1 px-2">
                      <button
                        type="button"
                        className="py-3 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border bg-color-1 text-color-6 shadow-sm hover:bg-6hover disabled:opacity-50 disabled:pointer-events-none "
                        data-hs-overlay="#hs-filter-date"
                      >
                        <FontAwesomeIcon icon={faCalendarDays} /> Filter
                      </button>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        className="py-3 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border bg-color-1 text-color-6 shadow-sm hover:bg-6hover disabled:opacity-50 disabled:pointer-events-none "
                        data-hs-overlay="#hs-tambah-alert"
                      >
                        + Pemasukan
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col mt-5">
                  <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                      <div className="border rounded-lg">
                        <div className="overflow-hidden">
                          <table className="table-fixed md:table-fixed min-w-full divide-y ">
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
                                  Tanggal
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-center text-sm font-boldtext-color-5 uppercase"
                                >
                                  Barang
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-center text-sm font-boldtext-color-5 uppercase"
                                >
                                  QTY
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-center text-sm font-boldtext-color-5 uppercase"
                                >
                                  Pemasukan
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-center text-sm font-boldtext-color-5 uppercase"
                                >
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              <tr>
                                <td className="px-6 text-center py-4 whitespace-nowrap text-sm font-medium text-color-5">
                                  1.
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5">
                                  Minggu, 17 Desember 2023
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5 text-center">
                                  Anti Gores Redmi Note 11
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5 text-center">
                                  3
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5 text-center">
                                  Rp. 75000
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-color-5">
                                  <div className="text-center ">
                                    <button className="deleteBtn py-3 mx-1 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none ">
                                      <FontAwesomeIcon icon={faTrashCan} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 text-center py-4 whitespace-nowrap text-sm font-medium text-color-5">
                                  2.
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5">
                                  Minggu, 17 Desember 2023
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5 text-center">
                                  Kabel USB 120 W
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5 text-center">
                                  1
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5 text-center">
                                  Rp. 85000
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-color-5">
                                  <div className="text-center ">
                                    <button className="deleteBtn py-3 mx-1 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none ">
                                      <FontAwesomeIcon icon={faTrashCan} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 text-center py-4 whitespace-nowrap text-sm font-medium text-color-5">
                                  3.
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5">
                                  Jumat, 15 Desember 2023
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5 text-center">
                                  Power Bank 10000 mAh
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5 text-center">
                                  1
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5 text-center">
                                  Rp. 260000
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-color-5">
                                  <div className="text-center ">
                                    <button className="deleteBtn py-3 mx-1 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none ">
                                      <FontAwesomeIcon icon={faTrashCan} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 text-center py-4 whitespace-nowrap text-sm font-medium text-color-5">
                                  4.
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5">
                                  Jumat, 15 Desember 2023
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5 text-center">
                                  Kabel data Micro USB
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5 text-center">
                                  5
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5 text-center">
                                  Rp. 125000
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-color-5">
                                  <div className="text-center ">
                                    <button className="deleteBtn py-3 mx-1 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none ">
                                      <FontAwesomeIcon icon={faTrashCan} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 text-center py-4 whitespace-nowrap text-sm font-medium text-color-5">
                                  5.
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5">
                                  Kamis, 14 Desember 2023
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5 text-center">
                                  Kepala Charger 33 Watt
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5 text-center">
                                  1
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5 text-center">
                                  Rp. 128000
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-color-5">
                                  <div className="text-center ">
                                    <button className="deleteBtn py-3 mx-1 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none ">
                                      <FontAwesomeIcon icon={faTrashCan} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>

                          {/* Modals Filter date */}
                          <div
                            id="hs-filter-date"
                            className="hs-overlay hidden w-full h-full fixed top-0 start-0 z-[70] overflow-x-hidden overflow-y-auto"
                          >
                            <div className="hs-overlay-open:mt-10  hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all md:max-w-xl pt-20 md:w-full m-3 md:mx-auto">
                              <div className="relative flex flex-col shadow-md rounded-xl overflow-hidden dark:bg-color-3 ">
                                <div className="absolute top-2 m-3 end-2">
                                  <button
                                    type="button"
                                    className="flex justify-center items-center w-7 h-7 text-md font-semibold rounded-lg border border-transparent text-color-5 disabled:opacity-50 disabled:pointer-events-none dark:text-color-5 dark:border-transparent  dark:focus:outline-none "
                                    data-hs-overlay="#hs-filter-date"
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

                                <form>
                                  <div className="p-4 sm:p-10 overflow-y-auto">
                                    <div className="flex gap-x-4 md:gap-x-7">
                                      <div className="grow">
                                        <h3 className="mb-2 text-3xl font-bold text-gray-800 dark:text-gray-700">
                                          Filter Pemasukan
                                        </h3>
                                        <div className=" mt-10 grid grid-cols-10 justify-items-center gap-3">
                                          <div className="col-span-4 flex">
                                            <input
                                              type="date"
                                              className="py-3 px-4 block w-full border-color-1 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-1 focus:ring-color-1 disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:border-color-1 dark:text-gray-400 dark:focus:ring-color-1"
                                            />
                                          </div>
                                          <div className="col-span flex">
                                            <p className="mt-2">sampai</p>
                                          </div>
                                          <div className="col-span-4 flex">
                                            <input
                                              type="date"
                                              className="py-3 px-4 block w-full border-color-1 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-1 focus:ring-color-1 disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:border-color-1 dark:text-gray-400 dark:focus:ring-color-1"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex justify-end items-center gap-x-2 py-3 px-4 bg-gray-50 border-t  dark:border-gray-300">
                                    <button
                                      type="button"
                                      className="py-2 px-5 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-color-5  shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-zinc-200 dark:border-color-5dark:text-color-5 dark:hover:bg-zinc-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-color-5"
                                      data-hs-overlay="#hs-filter-date"
                                    >
                                      Kembali
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>

                          {/* MODALS FORM Tambah */}
                          <div
                            id="hs-tambah-alert"
                            className="hs-overlay hidden w-full h-full fixed top-0 start-0 z-[70] overflow-x-hidden overflow-y-auto"
                          >
                            <div className="hs-overlay-open:mt-10  hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all md:max-w-xl pt-20 md:w-full m-3 md:mx-auto">
                              <div className="relative flex flex-col shadow-md rounded-xl overflow-hidden dark:bg-color-3 ">
                                <div className="absolute top-2 m-3 end-2">
                                  <button
                                    type="button"
                                    className="flex justify-center items-center w-7 h-7 text-md font-semibold rounded-lg border border-transparent text-color-5 disabled:opacity-50 disabled:pointer-events-none dark:text-color-5 dark:border-transparent  dark:focus:outline-none "
                                    data-hs-overlay="#hs-tambah-alert"
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

                                <form>
                                  <div className="p-4 sm:p-10 overflow-y-auto">
                                    <div className="flex gap-x-4 md:gap-x-7">
                                      <div className="grow">
                                        <h3 className="mb-2 text-3xl font-bold text-gray-800 dark:text-gray-700">
                                          Form Tambah Pemasukan
                                        </h3>
                                        <div className="mt-10 grid grid-cols-10 gap-3">
                                          <div className="col-span-5">
                                            <label
                                              htmlFor="hs-leading-icon"
                                              className="block text-md font-medium mb-2 dark:text-color-5"
                                            >
                                              Tanggal{" "}
                                              <span className="italic text-color-warning">
                                                *
                                              </span>
                                            </label>
                                            <div className="relative">
                                              <input
                                                type="date"
                                                name="hs-leading-icon"
                                                className="py-3 px-4 block w-full border-color-3 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-2"
                                              />
                                            </div>
                                          </div>
                                          <div className="col-span-5">
                                            <label
                                              htmlFor="hs-leading-icon"
                                              className="block text-md font-medium mb-2 dark:text-color-5"
                                            >
                                              Barang{" "}
                                              <span className="italic text-color-warning">
                                                *
                                              </span>
                                            </label>
                                            <div className="relative">
                                              <select
                                                id="hs-select-label"
                                                className="py-3 px-4 pe-9 block w-full  border-color-3 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-2"
                                              >
                                                <option value="">
                                                  Pilih barang
                                                </option>

                                                <option>ss</option>
                                              </select>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="mt-4 grid grid-cols-10 gap-3">
                                          <div className="col-span-5">
                                            <label
                                              htmlFor="hs-leading-icon"
                                              className="block text-md font-medium mb-2 dark:text-color-5"
                                            >
                                              Pemasukan{" "}
                                              <span className="italic text-color-warning">
                                                *
                                              </span>
                                            </label>
                                            <div className="relative">
                                              <div className="flex rounded-lg shadow-sm">
                                                <div className="px-3.5 inline-flex items-center min-w-fit rounded-s-md border border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-2 dark:text-gray-400 dark:focus:ring-color-2">
                                                  <span className="text-sm text-color-4 font-semibold">
                                                    Rp.
                                                  </span>
                                                </div>
                                                <input
                                                  type="text"
                                                  name="hs-input-with-add-on-url"
                                                  className="py-3 px-4 pe-11  block w-full border-color-3 shadow-sm rounded-e-md text-sm focus:z-10 focus:border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-2"
                                                  placeholder="..."
                                                />
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-span-4">
                                            <label
                                              htmlFor="hs-leading-icon"
                                              className="block text-md font-medium mb-2 dark:text-color-5"
                                            >
                                              QTY{" "}
                                              <span className="italic text-color-warning">
                                                *
                                              </span>
                                            </label>
                                            <div className="relative">
                                              <input
                                                type="text"
                                                name="hs-leading-icon"
                                                placeholder="..."
                                                className="py-3 px-4 block w-full border-color-3 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-2"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex justify-end items-center gap-x-2 py-3 px-4 bg-gray-50 border-t  dark:border-gray-300">
                                    <button
                                      type="button"
                                      className="py-2 px-5 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-color-5  shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-zinc-200 dark:border-color-5dark:text-color-5 dark:hover:bg-zinc-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-color-5"
                                      data-hs-overlay="#hs-tambah-alert"
                                    >
                                      Kembali
                                    </button>
                                    <button
                                      type="submit"
                                      className="py-2 px-8 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-color-1 text-white hover:bg-6hover disabled:opacity-50 disabled:pointer-events-none "
                                    >
                                      Tambah Pemasukan
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className=" py-1 px-8">
                          <nav className="flex items-center justify-start space-x-1">
                            <button
                              type="button"
                              className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-color-5 hover:text-color-6 disabled:opacity-50 disabled:pointer-events-none dark:text-color-5 dark:hover:bg-color-1 "
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
                              className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-color-5 hover:text-color-6 disabled:opacity-50 disabled:pointer-events-none dark:text-color-5 dark:hover:bg-color-1 "
                            >
                              <span className="sr-only">Next</span>
                              <span aria-hidden="true">»</span>
                            </button>
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
      </div>
    </>
  );
};

export default Pemasukan;
