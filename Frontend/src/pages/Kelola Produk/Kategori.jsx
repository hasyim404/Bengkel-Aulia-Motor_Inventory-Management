import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

import Navbar from "../../components/Navbar/Navbar";
import MainTitle from "../../components/MainTitle";
import Subnav from "../../components/Subnav";

import { useUser } from "../../context/UserContext";
import SearchBar from "../../components/SearchBar/SearchBar";
import Pagination from "../../components/Pagination/Pagination";
import NoData from "../../components/NoData";

const Kategori = () => {
  const { checkRoleAndNavigate } = useUser();
  const navigate = useNavigate();

  const [kategori, setKategori] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = kategori.slice(firstIndex, lastIndex);
  const npage = Math.ceil(kategori.length / recordsPerPage);

  const [n_kategori, setN_kategori] = useState("");
  const [catatan, setCatatan] = useState("");
  const [query, setQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState();

  // Function to open the modal with the selected item
  const openModal = (item) => {
    setCurrentItem({ ...item });
    setIsModalOpen(true);
  };

  // Function to close the modal and reset currentItem
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("n_kategori", currentItem.n_kategori);
    formData.append("catatan", currentItem.catatan);

    try {
      const url = `http://localhost:1023/api/v1/kategori/${currentItem.id}`;
      await axios.put(url, formData);
      Swal.fire({
        title: "Edit Data kategori Berhasil!",
        text: "Berhasil edit data kategori!",
        icon: "success",
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      if (error.response.status === 409) {
        Swal.fire({
          title: "Gagal edit kategori!",
          text: `Nama kategori duplikat...`,
          icon: "warning",
        }).then(() => {
          // window.location.reload();
        });
      } else {
        Swal.fire({
          title: "Gagal edit kategori!",
          text: `Gagal karena ${error.response.data.message}`,
          icon: "error",
        }).then(() => {
          // window.location.reload();
        });
      }
    }
    closeModal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  useEffect(() => {
    const allowed = checkRoleAndNavigate(["pemilik", "karyawan"], navigate);

    if (!allowed) {
      //
    }

    getKategori();
    cariKategori();
  }, [navigate, query]);

  const cariKategori = async () => {
    const response = await axios.get(
      `http://localhost:1023/api/v1/kategori?q=${query}`
    );
    setKategori(response.data.qq);
  };

  // Get all data
  const getKategori = async () => {
    const response = await axios.get("http://localhost:1023/api/v1/kategori");
    setKategori(response.data.data);
  };

  // Add data
  const addKategori = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:1023/api/v1/kategori", {
        n_kategori,
        catatan,
      });

      Swal.fire({
        title: "Tambah Data Kategori Berhasil!",
        text: "Berhasil menambahkan data kategori baru!",
        icon: "success",
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Gagal tambah data kategori!",
        text: `Gagal karena ${error.response.data.message}`,
        icon: "error",
      }).then(() => {
        // window.location.reload();
      });
    }
  };

  // Delete
  const deleteKategori = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:1023/api/v1/kategori/${id}`
      );

      const namaKategori = response.data.data[0].n_kategori;

      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        html: `Anda akan menghapus<br/>${namaKategori}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Hapus",
      });
      if (result.isConfirmed) {
        await axios.delete(`http://localhost:1023/api/v1/kategori/${id}`);

        // Tampilkan pesan keberhasilan
        await Swal.fire({
          title: "Hapus data kategori berhasil!",
          icon: "success",
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Hapus data kategori gagal!",
        text: `Gagal karena ${error.response.data.message}`,
        icon: "error",
      }).then(() => {
        window.location.reload();
      });
    }
  };

  return (
    <>
      <Navbar active="active" display="block" />
      <div className="w-full pt-10 px-4 sm:px-6 md:px-8 lg:ps-72">
        <MainTitle size="text-3xl" main="Kelola Produk" />
        <p className="mb-2 text-md font-normal text-color-4">
          {" "}
          <Link className="text-color-4" to="/dashboard">
            Dashboard{" "}
          </Link>
          / <span className="text-color-5 italic">Kelola Produk </span>/
          <span className="xt-color-5 italic"> Kategori</span>
        </p>

        {/* Content */}
        <div className="px-4 py-10 sm:px-6 lg:px-0 lg:py-5 ">
          <div className="mt-6 ">
            <div className="flex flex-col bg-white shadow-md rounded-xl hover:shadow-md transition dark:bg-color-6 col-span-2 ">
              <div className="p-4 md:p-5">
                <div className="grid grid-flow-col gap-4 place-content-between">
                  <div className="col-span-3">
                    <MainTitle size="text-xl" main="Daftar Kategori" />
                    <Subnav
                      subnav="Berisi daftar seluruh kategori"
                      color="text-color-4"
                    />
                  </div>
                  <div className="col-span-7 flex justify-end">
                    <div className="py-2 px-3">
                      <SearchBar setQuery={setQuery} setName={"Kategori"} />
                    </div>

                    <div className="py-1 2">
                      <button
                        type="button"
                        className="py-3 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border bg-color-1 text-color-6 shadow-sm hover:bg-6hover disabled:opacity-50 disabled:pointer-events-none "
                        data-hs-overlay="#hs-tambah-alert"
                      >
                        + Tambah Kategori
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col mt-5">
                  <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                      <div className="border rounded-lg">
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
                                      Nama
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-center text-sm font-boldtext-color-5 uppercase"
                                    >
                                      Catatan
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
                                          (currentPage - 1) * recordsPerPage}
                                        .
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5">
                                        {item.n_kategori}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5 text-center">
                                        {item.catatan !== ""
                                          ? item.catatan
                                          : "-"}
                                      </td>

                                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-color-5">
                                        <div className="text-center ">
                                          {/* <Link
                                        to={`/kelola-produk/kategori/edit/${item.id}`}
                                      > */}
                                          <button
                                            className="py-3 mx-1 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50 disabled:pointer-events-none "
                                            data-hs-overlay="#hs-edit-alert"
                                            onClick={() => openModal(item)}
                                          >
                                            <FontAwesomeIcon
                                              icon={faPenToSquare}
                                            />
                                          </button>
                                          {/* </Link> */}
                                          <button
                                            onClick={() =>
                                              deleteKategori(item.id)
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

                              {/* MODALS FORM Edit */}
                              {isModalOpen && currentItem && (
                                <div
                                  id="hs-edit-alert"
                                  className="hs-overlay hidden w-full h-full fixed top-0 start-0 z-[70] overflow-x-hidden overflow-y-auto"
                                >
                                  <div className="hs-overlay-open:mt-10  hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all md:max-w-xl pt-20 md:w-full m-3 md:mx-auto">
                                    <div className="relative flex flex-col shadow-md rounded-xl overflow-hidden dark:bg-color-3 ">
                                      <div className="absolute top-2 m-3 end-2">
                                        <button
                                          type="button"
                                          className="flex justify-center items-center w-7 h-7 text-md font-semibold rounded-lg border border-transparent text-color-5 disabled:opacity-50 disabled:pointer-events-none dark:text-color-5 dark:border-transparent  dark:focus:outline-none "
                                          data-hs-overlay="#hs-edit-alert"
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

                                      <form onSubmit={handleEdit}>
                                        <div className="p-4 sm:p-10 overflow-y-auto">
                                          <div className="flex gap-x-4 md:gap-x-7">
                                            <div className="grow">
                                              <h3 className="mb-2 text-3xl font-bold text-gray-800 dark:text-gray-700">
                                                Form Edit Kategori
                                              </h3>
                                              <div className="mt-10 grid grid-cols-10 gap-3">
                                                <div className="col-span-3 flex">
                                                  <label
                                                    htmlFor="hs-leading-icon"
                                                    className="mt-2 block text-md font-medium mb-2 dark:text-color-5"
                                                  >
                                                    Nama Kategori{" "}
                                                    <span className="italic text-color-warning">
                                                      *
                                                    </span>
                                                  </label>

                                                  <p className="mt-2 ml-4">:</p>
                                                </div>
                                                <div className="col-span-7">
                                                  <div className="relative">
                                                    <input
                                                      type="text"
                                                      name="n_kategori"
                                                      value={
                                                        currentItem.n_kategori
                                                      }
                                                      onChange={handleChange}
                                                      className="py-3 px-4 block w-full border-color-1 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-1 focus:ring-color-1 disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:border-color-1 dark:text-gray-400 dark:focus:ring-color-1"
                                                      placeholder="..."
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="mt-5 grid grid-cols-10 gap-3">
                                                <div className="col-span-3 flex">
                                                  <label
                                                    htmlFor="hs-leading-icon"
                                                    className="mt-2 block text-md font-medium mb-2 dark:text-color-5"
                                                  >
                                                    Catatan
                                                  </label>

                                                  <p className="mt-2 ml-20">
                                                    :
                                                  </p>
                                                </div>
                                                <div className="col-span-7">
                                                  <div className="relative">
                                                    <input
                                                      type="text"
                                                      name="catatan"
                                                      value={
                                                        currentItem.catatan
                                                      }
                                                      onChange={handleChange}
                                                      className="py-3 px-4 block w-full border-color-1 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-1 focus:ring-color-1 disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:border-color-1 dark:text-gray-400 dark:focus:ring-color-1"
                                                      placeholder="Tambah Catatan"
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
                                            data-hs-overlay="#hs-edit-alert"
                                          >
                                            Kembali
                                          </button>
                                          <button
                                            type="submit"
                                            className="py-2 px-8 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50 disabled:pointer-events-none "
                                          >
                                            Edit Kategori
                                          </button>
                                        </div>
                                      </form>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <Pagination
                              currentPage={currentPage}
                              setCurrentPage={setCurrentPage}
                              npage={npage}
                              data={kategori.length}
                              show={records.length}
                              setName={"Kategori"}
                            />
                          </>
                        ) : (
                          <>
                            <NoData name={"Kategori"} />
                          </>
                        )}
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

                              <form onSubmit={addKategori}>
                                <div className="p-4 sm:p-10 overflow-y-auto">
                                  <div className="flex gap-x-4 md:gap-x-7">
                                    <div className="grow">
                                      <h3 className="mb-2 text-3xl font-bold text-gray-800 dark:text-gray-700">
                                        Form Tambah Kategori
                                      </h3>
                                      <div className="mt-10 grid grid-cols-10 gap-3">
                                        <div className="col-span-3 flex">
                                          <label
                                            htmlFor="hs-leading-icon"
                                            className="mt-2 block text-md font-medium mb-2 dark:text-color-5"
                                          >
                                            Nama Kategori{" "}
                                            <span className="italic text-color-warning">
                                              *
                                            </span>
                                          </label>

                                          <p className="mt-2 ml-4">:</p>
                                        </div>
                                        <div className="col-span-7">
                                          <div className="relative">
                                            <input
                                              type="text"
                                              name="hs-leading-icon"
                                              value={n_kategori}
                                              onChange={(e) =>
                                                setN_kategori(e.target.value)
                                              }
                                              className="py-3 px-4 block w-full border-color-1 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-1 focus:ring-color-1 disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:border-color-1 dark:text-gray-400 dark:focus:ring-color-1"
                                              placeholder="..."
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="mt-5 grid grid-cols-10 gap-3">
                                        <div className="col-span-3 flex">
                                          <label
                                            htmlFor="hs-leading-icon"
                                            className="mt-2 block text-md font-medium mb-2 dark:text-color-5"
                                          >
                                            Catatan
                                          </label>

                                          <p className="mt-2 ml-20">:</p>
                                        </div>
                                        <div className="col-span-7">
                                          <div className="relative">
                                            <input
                                              type="text"
                                              name="hs-leading-icon"
                                              value={catatan}
                                              onChange={(e) =>
                                                setCatatan(e.target.value)
                                              }
                                              className="py-3 px-4 block w-full border-color-1 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-1 focus:ring-color-1 disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:border-color-1 dark:text-gray-400 dark:focus:ring-color-1"
                                              placeholder="Tambah Catatan"
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
                                    Tambah Kategori
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

export default Kategori;
