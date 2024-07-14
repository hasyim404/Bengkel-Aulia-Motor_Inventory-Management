import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faCalendarDays,
  faFileExcel,
  faFilePdf,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

import Navbar from "../../components/Navbar/Navbar";
import Subnav from "../../components/Subnav";
import MainTitle from "../../components/MainTitle";
import { useUser } from "../../context/UserContext";

import Pagination from "../../components/Pagination/Pagination";
import NoData from "../../components/NoData";

const Pengeluaran = () => {
  const { checkRoleAndNavigate } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [allPengeluaran, setAllPengeluaran] = useState([]);
  const [tgl, setTgl] = useState("");
  const [nama, setNama] = useState("");
  const [qty, setQty] = useState("");
  const [pengeluaran, setPengeluaran] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [withoutFilter, setWithoutFilter] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = allPengeluaran.slice(firstIndex, lastIndex);
  const npage = Math.ceil(allPengeluaran.length / recordsPerPage);

  useEffect(() => {
    const allowed = checkRoleAndNavigate("pemilik", navigate);
  }, [navigate]);

  useEffect(() => {
    if (withoutFilter) {
      setStartDate("");
      setEndDate("");
    } else {
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      setEndDate(today.toISOString().split("T")[0]);
      setStartDate(thirtyDaysAgo.toISOString().split("T")[0]);
    }
  }, [withoutFilter]);

  useEffect(() => {
    if (withoutFilter) {
      getPengeluaran();
    } else if (startDate && endDate) {
      getPengeluaran();
    }
  }, [startDate, endDate, withoutFilter]);

  // Get all data
  const getPengeluaran = async () => {
    let url = "http://localhost:1023/api/v1/pengeluaran";

    if (!withoutFilter) {
      url += `?start=${startDate}&end=${endDate}`;
    }

    const response = await axios.get(url);
    setAllPengeluaran(response.data.data);
    setLoading(false);
  };

  // Add data
  const addPengeluaran = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:1023/api/v1/pengeluaran", {
        tgl,
        nama,
        qty,
        pengeluaran,
      });

      Swal.fire({
        title: "Tambah Data Pengeluaran Berhasil!",
        text: "Berhasil menambahkan data baru!",
        icon: "success",
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Gagal tambah data pengeluaran!",
        text: `Gagal karena ${error.response.data.message}`,
        icon: "error",
      }).then(() => {
        // window.location.reload();
      });
    }
  };

  // Delete data
  const deletePengeluaran = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:1023/api/v1/pengeluaran/${id}`
      );

      const namaPengeluaran = response.data.data[0].nama;

      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        html: `Anda akan menghapus<br/>${namaPengeluaran}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Hapus",
      });
      if (result.isConfirmed) {
        await axios.delete(`http://localhost:1023/api/v1/pengeluaran/${id}`);

        // Tampilkan pesan keberhasilan
        await Swal.fire({
          title: "Hapus data pengeluaran berhasil!",
          icon: "success",
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Hapus data pengeluaran gagal!",
        text: `Gagal karena ${error.response.data.message}`,
        icon: "error",
      }).then(() => {
        // window.location.reload();
      });
    }
  };

  // PDF
  const downloadPDF = async () => {
    let url = "http://localhost:1023/api/v1/pengeluaran/pdf/download";
    let urlNameFile = "http://localhost:1023/api/v1/pengeluaran/pdf/name";

    if (!withoutFilter) {
      url += `?start=${startDate}&end=${endDate}`;
    }

    try {
      const fileName = await axios.get(urlNameFile);

      const response = await axios.get(url, {
        responseType: "blob",
      });

      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", fileName.data.data);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.log("There was a problem with your fetch operation:", error);
      Swal.fire({
        title: "Gagal export PDF!",
        // text: `Gagal karena ${error.response.data.message}`,
        icon: "error",
      }).then(() => {
        // window.location.reload();
      });
    }
  };

  const toIDR = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  allPengeluaran.map((record) => {
    record.tgl = new Date(record.tgl);
  });

  const total = allPengeluaran
    .map((item) => item.pengeluaran)
    .reduce((a, b) => a + b, 0);

  const toDate = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const convToDate = (date) => {
    return new Date(date);
  };

  const formattedStartDate = startDate
    ? toDate.format(convToDate(startDate))
    : "";
  const formattedEndDate = endDate ? toDate.format(convToDate(endDate)) : "";

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
          <span className="xt-color-5 italic"> Pengeluaran</span>
        </p>

        {/* Content */}
        <div className="px-4 py-10 sm:px-6 lg:px-0 lg:py-5 ">
          <div className="mt-6 ">
            <div className="flex flex-col bg-white shadow-md rounded-xl hover:shadow-md transition dark:bg-color-6 col-span-2 ">
              <div className="p-4 md:p-5">
                <div className="grid grid-flow-col gap-4 place-content-between">
                  <div className="col-span-3">
                    <MainTitle size="text-xl" main="Data Pengeluaran" />
                    <Subnav
                      subnav="Berisi daftar dari seluruh Pengeluaran"
                      color="text-color-4"
                    />
                  </div>
                  <div className="col-span-7 flex justify-end">
                    <div className="py-1 px-2">
                      <p
                        data-hs-overlay="#hs-filter-date"
                        className="font-semibold underline underline-offset-4 cursor-pointer"
                      >
                        {startDate && endDate != ""
                          ? `${formattedStartDate} - ${formattedEndDate}`
                          : "Semua Data / No Filter"}
                      </p>
                      <p className="font-semibold">
                        Total pengeluaran:{" "}
                        <span className="font-normal text-color-4">
                          {toIDR.format(total)}
                        </span>
                      </p>
                    </div>

                    <div className="py-1 pl-1">
                      <button
                        type="button"
                        className="py-3 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border bg-color-1 text-color-6 shadow-sm hover:bg-6hover disabled:opacity-50 disabled:pointer-events-none "
                        data-hs-overlay="#hs-filter-date"
                      >
                        <FontAwesomeIcon icon={faCalendarDays} /> Filter
                      </button>
                    </div>

                    <div className="py-1 ">
                      <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
                        <button
                          id="hs-dropdown"
                          type="button"
                          className="hs-dropdown-toggle py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-color-1  dark:text-white dark:hover:bg-6hover"
                        >
                          Export
                          <FontAwesomeIcon icon={faChevronDown} />
                        </button>

                        <div
                          className="hs-dropdown-menu w-40 transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden z-10 bg-white shadow-md rounded-lg p-2 dark:bg-color-1 "
                          aria-labelledby="hs-dropdown"
                        >
                          <button
                            type="button"
                            className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-color-6 dark:hover:bg-6hover dark:hover:text-color-6 dark:focus:bg-gray-700"
                            onClick={downloadPDF}
                          >
                            <FontAwesomeIcon icon={faFilePdf} /> PDF
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        className="py-3 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border bg-color-1 text-color-6 shadow-sm hover:bg-6hover disabled:opacity-50 disabled:pointer-events-none "
                        data-hs-overlay="#hs-tambah-alert"
                      >
                        + Pengeluaran
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col mt-5">
                  <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                      <div className="border rounded-lg">
                        {loading === true ? (
                          <>
                            <div className="w-full py-28">
                              <div className="flex justify-center animate-pulse">
                                <img
                                  src="../src/assets/loading.webp"
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
                                          Total Pengeluaran
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
                                      {records.map((item, index) => (
                                        <tr key={index}>
                                          <td className="px-6 text-center py-4 whitespace-nowrap text-sm font-medium text-color-5">
                                            {index +
                                              1 +
                                              (currentPage - 1) *
                                                recordsPerPage}
                                            .
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5">
                                            {toDate.format(item.tgl)}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5 text-center">
                                            {item.nama}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5 text-center">
                                            {item.qty}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5 text-center">
                                            {toIDR.format(item.pengeluaran)}
                                          </td>

                                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-color-5">
                                            <div className="text-center ">
                                              <button
                                                onClick={() =>
                                                  deletePengeluaran(item.id)
                                                }
                                                className="deleteBtn py-3 mx-1 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none "
                                              >
                                                <FontAwesomeIcon
                                                  icon={faTrashCan}
                                                />
                                              </button>
                                            </div>
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
                                  data={allPengeluaran.length}
                                  show={records.length}
                                  setName={"Pengeluaran"}
                                />
                              </>
                            ) : (
                              <>
                                <NoData name={"Pengeluaran"} />
                              </>
                            )}
                          </>
                        )}
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
                                        Filter pengeluaran
                                      </h3>

                                      <div className=" mt-10 grid grid-cols-10 justify-items-center gap-3">
                                        <div className="col-span-4 flex">
                                          <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) =>
                                              setStartDate(e.target.value)
                                            }
                                            className="py-3 px-4 block w-full border-color-1 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-1 focus:ring-color-1 disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:border-color-1 dark:text-gray-400 dark:focus:ring-color-1"
                                            disabled={!startDate}
                                          />
                                        </div>
                                        <div className="col-span flex">
                                          <p className="mt-2">sampai</p>
                                        </div>
                                        <div className="col-span-4 flex">
                                          <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) =>
                                              setEndDate(e.target.value)
                                            }
                                            disabled={!endDate}
                                            className="py-3 px-4 block w-full border-color-1 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-1 focus:ring-color-1 disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:border-color-1 dark:text-gray-400 dark:focus:ring-color-1"
                                          />
                                        </div>
                                      </div>

                                      <div className="mt-10 justify-items-center font-bold">
                                        <h5>
                                          Tanpa Filter (Tampil semua data)
                                        </h5>
                                        <label className="mt-2 ml-1 inline-flex items-center cursor-pointer">
                                          <input
                                            type="checkbox"
                                            checked={withoutFilter}
                                            onChange={() =>
                                              setWithoutFilter(!withoutFilter)
                                            }
                                            className="sr-only peer"
                                          />
                                          <div className="relative w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-color-1 rounded-full peer dark:bg-color-5 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-color-1"></div>
                                          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-800">
                                            {withoutFilter
                                              ? "Aktif"
                                              : "Non-Aktif"}
                                          </span>
                                        </label>
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

                              <form onSubmit={addPengeluaran}>
                                <div className="p-4 sm:p-10 overflow-y-auto">
                                  <div className="flex gap-x-4 md:gap-x-7">
                                    <div className="grow">
                                      <h3 className="mb-2 text-3xl font-bold text-gray-800 dark:text-gray-700">
                                        Form Tambah pengeluaran
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
                                              value={tgl}
                                              onChange={(e) =>
                                                setTgl(e.target.value)
                                              }
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
                                            <input
                                              type="text"
                                              value={nama}
                                              onChange={(e) =>
                                                setNama(e.target.value)
                                              }
                                              className="py-3 px-4 block w-full border-color-3 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-2"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="mt-4 grid grid-cols-10 gap-3">
                                        <div className="col-span-5">
                                          <label
                                            htmlFor="hs-leading-icon"
                                            className="block text-md font-medium mb-2 dark:text-color-5"
                                          >
                                            pengeluaran{" "}
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
                                                type="number"
                                                value={pengeluaran}
                                                onChange={(e) =>
                                                  setPengeluaran(e.target.value)
                                                }
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
                                              type="number"
                                              value={qty}
                                              onChange={(e) =>
                                                setQty(e.target.value)
                                              }
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
                                    Tambah pengeluaran
                                  </button>
                                </div>
                              </form>
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
        </div>
      </div>
    </>
  );
};

export default Pengeluaran;
