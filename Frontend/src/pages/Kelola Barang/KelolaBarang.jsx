import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrashCan,
  faFileExcel,
  faChevronDown,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import Zoom from "react-medium-image-zoom";

import MainTitle from "../../components/MainTitle";
import Navbar from "../../components/Navbar/Navbar";
import Subnav from "../../components/Subnav";

import { useUser } from "../../context/UserContext";
import Pagination from "../../components/Pagination/Pagination";
import SearchBar from "../../components/SearchBar/SearchBar";
import NoData from "../../components/NoData";

import Select from "react-select";
import ENDPOINTS from "../../utils/constants/constant";
import { Helmet } from "react-helmet-async";

const KelolaBarang = () => {
  const { checkRoleAndNavigate, getUserData } = useUser();
  const navigate = useNavigate();
  const data = getUserData();
  const [loading, setLoading] = useState(true);
  const initialItem = {
    id_merk: "",
    id_kategori: "",
    id_ukuran: "",
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(initialItem);

  const [barang, setBarang] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = barang.slice(firstIndex, lastIndex);
  const npage = Math.ceil(barang.length / recordsPerPage);

  const [n_barang, setNBarang] = useState("");
  const [jml_stok, setJmlStok] = useState("");
  const [h_beli, setHBeli] = useState("");
  const [h_jual, setHJual] = useState("");
  const [merk_id, setMerkId] = useState("");
  const [merkIdOptions, setMerkIdOptions] = useState([]);
  const [img, setImg] = useState("");
  const [preview, setPreview] = useState("");
  const [kategori_id, setKategoriId] = useState("");
  const [kategoriIdOptions, setKategoriIdOptions] = useState([]);
  const [ukuran_id, setUkuranId] = useState("");
  const [ukuranIdOptions, setUkuranIdOptions] = useState([]);
  const [users_id, setUsersId] = useState([data.id]);
  const [query, setQuery] = useState("");

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
    // e.preventDefault();
    // const updatedBarang = barang.map((item) =>
    //   item.id_barang === currentItem.id_barang ? currentItem : item
    // );
    // setBarang(updatedBarang);
    e.preventDefault();
    const formData = new FormData();
    formData.append("n_barang", currentItem.n_barang);
    formData.append("jml_stok", currentItem.jml_stok);
    formData.append("tipe_stok", currentItem.tipe_stok);
    formData.append("h_beli", currentItem.h_beli);
    formData.append("h_jual", currentItem.h_jual);
    formData.append("merk_id", currentItem.id_merk);
    formData.append("img", img === "" ? currentItem.img : img);
    formData.append("kategori_id", currentItem.id_kategori);
    formData.append("ukuran_id", currentItem.id_ukuran);
    formData.append("users_id", users_id);
    formData.append("id", currentItem.id_barang);

    // Perform the update API request
    try {
      const url = `${ENDPOINTS.BARANG_ID(currentItem.id_barang)}`;
      await axios.put(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire({
        title: "Edit Data barang Berhasil!",
        text: "Berhasil edit data barang!",
        icon: "success",
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error(error);
      if (error.response.status === 409) {
        Swal.fire({
          title: "Gagal edit barang!",
          text: `Nama Barang duplikat...`,
          icon: "warning",
        }).then(() => {
          // window.location.reload();
        });
      } else {
        Swal.fire({
          title: "Gagal edit barang!",
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

  const handleNumInput = (e) => {
    if (
      !(
        // Tombol-tombol khusus yang diizinkan: backspace, delete, arrow keys, dan tab
        (
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight" ||
          e.key === "Backspace" ||
          e.key === "Delete" ||
          e.key === "Tab" ||
          // Angka dari 0 sampai 9
          (parseInt(e.key) >= 0 && parseInt(e.key) <= 9)
        )
      )
    ) {
      e.preventDefault(); // Mencegah karakter lain dimasukkan
    }
  };

  // Handle Select
  // Tipe Stok
  const optionsStok = [
    { value: "pcs", text: "-/pcs" },
    { value: "box", text: "-/box" },
    { value: "set", text: "-/set" },
    { value: "botol", text: "-/botol" },
    { value: "-", text: "-/-" },
  ];
  const [tipe_stok, setTipeStok] = useState("");
  const handleTipeStok = (e) => {
    setTipeStok(e.target.value);
  };

  useEffect(() => {
    const allowed = checkRoleAndNavigate(["pemilik", "karyawan"], navigate);

    if (!allowed) {
      //
    }

    getBarang();
    getMerk();
    getKategori();
    getUkuran();
    cariBarang();
  }, [navigate, query]);

  const loadImage = (e) => {
    const image = e.target.files[0];
    setImg(image);
    if (e.target.files.length !== 0) {
      setPreview(URL.createObjectURL(image));
    }
  };

  const cariBarang = async () => {
    const response = await axios.get(`${ENDPOINTS.BARANG}?q=${query}`);
    setBarang(response.data.qq);
  };

  // Get Data
  // Get data barang
  const getBarang = async () => {
    const response = await axios.get(ENDPOINTS.BARANG);
    setBarang(response.data.data);
    setLoading(false);
  };
  // Get data merk
  const getMerk = async () => {
    const response = await axios.get(ENDPOINTS.MERK);
    setMerkIdOptions(response.data.data);
  };
  // Get data kategori
  const getKategori = async () => {
    const response = await axios.get(ENDPOINTS.KATEGORI);
    setKategoriIdOptions(response.data.data);
  };
  // Get data ukuran
  const getUkuran = async () => {
    const response = await axios.get(ENDPOINTS.UKURAN);
    setUkuranIdOptions(response.data.data);
  };

  // Add data barang
  const addBarang = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("n_barang", n_barang);
    formData.append("jml_stok", jml_stok);
    formData.append("tipe_stok", tipe_stok);
    formData.append("h_beli", h_beli);
    formData.append("h_jual", h_jual);
    formData.append("merk_id", currentItem.id_merk);
    formData.append("img", img);
    formData.append("kategori_id", currentItem.id_kategori);
    formData.append("ukuran_id", currentItem.id_ukuran);
    formData.append("users_id", users_id);
    try {
      await axios.post(ENDPOINTS.BARANG, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        title: "Tambah Data Berhasil!",
        text: "Berhasil menambahkan data baru!",
        icon: "success",
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Gagal tambah data!",
        text: `Gagal karena ${error.response.data.message}`,
        icon: "error",
      });
    }
  };

  // Delete data barang
  const deleteBarang = async (id, e) => {
    try {
      // console.log(id);
      const response = await axios.get(ENDPOINTS.BARANG_ID(id));

      const namaBarang = response.data.data[0].n_barang;

      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        html: `Anda akan menghapus<br/>${namaBarang}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Hapus",
      });
      if (result.isConfirmed) {
        await axios.delete(ENDPOINTS.BARANG_ID(id));

        // Tampilkan pesan keberhasilan
        await Swal.fire({
          title: "Hapus data barang berhasil!",
          icon: "success",
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Hapus data gagal!",
        text: "Gagal menghapus data barang",
        icon: "error",
      }).then(() => {
        window.location.reload();
      });
    }
  };

  const theads = [
    {
      judul: "No",
    },
    {
      judul: "Nama Barang",
    },
    {
      judul: "Stok",
    },
    {
      judul: "Merk",
    },
    {
      judul: "Harga Beli",
    },
    {
      judul: "Harga Jual",
    },
    {
      judul: "Gambar",
    },
    {
      judul: "Action",
    },
  ];

  // PDF
  const downloadPDF = async () => {
    let url = `${ENDPOINTS.BARANG_PDF_DOWNLOAD}`;
    let urlNameFile = `${ENDPOINTS.BARANG_PDF_NAME}`;

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

  const merkOptions = merkIdOptions.map((data) => ({
    value: data.id,
    label: data.n_merk,
  }));

  const kategoriOptions = kategoriIdOptions.map((data) => ({
    value: data.id,
    label: data.n_kategori,
  }));

  const ukuranOptions = ukuranIdOptions.map((data) => ({
    value: data.id,
    label: data.n_ukuran,
  }));

  const handleChangeSelect = (name, selectedOption) => {
    setCurrentItem((prevItem) => ({
      ...prevItem,
      [name]: selectedOption ? selectedOption.value : "", // Pastikan nilai diatur dengan benar
    }));
  };

  return (
    <>
      <Helmet>
        <title>Kelola Barang | Aulia Motor</title>
      </Helmet>

      <Navbar active1="active" />
      <div className="w-full pt-10 px-4 sm:px-6 md:px-8 lg:ps-72">
        <MainTitle size="text-3xl" main="Kelola Barang" />
        <p className="mb-2 text-md font-normal text-color-4">
          <Link color="text-color-4" to="/dashboard">
            Dashboard{" "}
          </Link>
          /{" "}
          <span color="text-color-5" className="italic">
            Kelola Barang
          </span>
        </p>

        {/* Content */}
        <div className="px-4 py-10 sm:px-6 lg:px-0 lg:py-5 ">
          <div className="mt-6 ">
            <div className="flex flex-col bg-white shadow-md rounded-xl hover:shadow-md transition dark:bg-color-6 col-span-2 ">
              <div className="p-4 md:p-5">
                <div className="grid grid-flow-col gap-4 place-content-between">
                  <div className="col-span-3">
                    <MainTitle size="text-xl" main="Data Barang" />
                    <Subnav
                      subnav="Berisi daftar dari semua barang"
                      color="text-color-4"
                    />
                  </div>
                  <div className="col-span-7 flex justify-end">
                    <div className="py-2 px-3">
                      <SearchBar setQuery={setQuery} setName={"Barang"} />
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
                    <div className="py-1 pl-2">
                      <button
                        type="button"
                        className="py-3 px-6 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border bg-color-1 text-color-6 shadow-sm hover:bg-6hover disabled:opacity-50 disabled:pointer-events-none "
                        data-hs-overlay="#hs-tambah-alert"
                      >
                        + Tambah Barang
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
                                  <table className="table-fixed md:table-fixed min-w-full divide-y ">
                                    <thead className=" dark:bg-color-6">
                                      <tr>
                                        {theads.map((thead, index) => (
                                          <th
                                            key={index}
                                            scope="col"
                                            className="py-3 text-sm font-bold text-color-5 uppercase"
                                          >
                                            {thead.judul}
                                          </th>
                                        ))}
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
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-color-5">
                                            {item.n_barang}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-color-5">
                                            {item.jml_stok} -/{item.tipe_stok}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-color-5">
                                            {item.n_merk}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-color-5">
                                            {toIDR.format(item.h_beli)}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-color-5">
                                            {toIDR.format(item.h_jual)}
                                          </td>
                                          <td className="flex justify-center items-center px-6 py-4 whitespace-nowrap text-sm ">
                                            <Zoom>
                                              <img
                                                className="w-20 border border-color-2 shadow-sm rounded-sm"
                                                src={
                                                  item.img === null
                                                    ? "./src/assets/no-preview.png"
                                                    : item.img === ""
                                                    ? "./src/assets/no-preview.png"
                                                    : item.img
                                                }
                                              />
                                            </Zoom>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-color-5">
                                            <div className="text-center">
                                              {/* <Link
                                        to={`/kelola-barang/edit/${item.id_barang}`}
                                      > */}
                                              <button
                                                type="button"
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
                                                type="buton"
                                                onClick={() =>
                                                  deleteBarang(item.id_barang)
                                                }
                                                className="py-3 mx-1 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:pointer-events-none "
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

                                  {/* MODALS FORM EDIT */}
                                  {isModalOpen && currentItem && (
                                    <div
                                      id="hs-edit-alert"
                                      className="hs-overlay hidden w-full h-full fixed top-0 start-0 z-[70] overflow-x-hidden overflow-y-auto"
                                    >
                                      <div className="hs-overlay-open:mt-10  hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all md:max-w-2xl md:w-full m-3 md:mx-auto">
                                        <div className="relative flex flex-col shadow-md rounded-xl overflow-hidden dark:bg-color-3 ">
                                          <div className="absolute top-2 m-3 end-2">
                                            <button
                                              type="button"
                                              className="flex justify-center items-center w-7 h-7 text-md font-semibold rounded-lg border border-transparent text-color-5 disabled:opacity-50 disabled:pointer-events-none dark:text-color-5 dark:border-transparent  dark:focus:outline-none "
                                              data-hs-overlay="#hs-edit-alert"
                                            >
                                              <span className="sr-only">
                                                Close
                                              </span>
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
                                                    Form Edit Barang
                                                  </h3>
                                                  <div className="mt-10 grid grid-cols-10 gap-3">
                                                    <div className="col-span-5">
                                                      <label
                                                        htmlFor="hs-leading-icon"
                                                        className="block text-md font-medium mb-2 dark:text-color-5"
                                                      >
                                                        Nama barang{" "}
                                                        <span className="italic text-color-warning">
                                                          *
                                                        </span>
                                                      </label>
                                                      <div className="relative">
                                                        <input
                                                          type="text"
                                                          name="n_barang"
                                                          value={
                                                            currentItem.n_barang
                                                          }
                                                          onChange={
                                                            handleChange
                                                          }
                                                          className="py-3 px-4 block w-full border-color-3 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-2"
                                                          placeholder="Masukkan nama barang"
                                                        />
                                                      </div>
                                                    </div>
                                                    <div className="col-span-5">
                                                      <label
                                                        htmlFor="hs-leading-icon"
                                                        className="block text-md font-medium mb-2 dark:text-color-5"
                                                      >
                                                        Harga Beli{" "}
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
                                                            onKeyDown={
                                                              handleNumInput
                                                            }
                                                            name="h_beli"
                                                            value={
                                                              currentItem.h_beli
                                                            }
                                                            onChange={
                                                              handleChange
                                                            }
                                                            className="py-3 px-4 pe-11  block w-full border-color-3 shadow-sm rounded-e-md text-sm focus:z-10 focus:border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-2"
                                                            placeholder="Masukkan harga beli"
                                                          />
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="mt-5 grid grid-cols-10 gap-3">
                                                    <div className="col-span-5">
                                                      <label
                                                        htmlFor="hs-leading-icon"
                                                        className="block text-md font-medium mb-2 dark:text-color-5"
                                                      >
                                                        Jumlah Stok{" "}
                                                        <span className="italic text-color-warning">
                                                          *
                                                        </span>
                                                      </label>
                                                      <div className="relative">
                                                        <input
                                                          type="text"
                                                          name="jml_stok"
                                                          value={
                                                            currentItem.jml_stok
                                                          }
                                                          onChange={
                                                            handleChange
                                                          }
                                                          className="py-3 px-4 block w-full border-color-3 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-2"
                                                          placeholder="Masukkan jumlah stok"
                                                        />
                                                        <div className="absolute inset-y-0 end-0 flex items-center text-gray-500 pe-px">
                                                          <label
                                                            htmlFor="hs-inline-leading-select-currency"
                                                            className="sr-only"
                                                          >
                                                            satuan barang
                                                          </label>
                                                          <select
                                                            id="hs-inline-leading-select-currency"
                                                            name="tipe_stok"
                                                            value={
                                                              currentItem.tipe_stok
                                                            }
                                                            onChange={
                                                              handleChange
                                                            }
                                                            className="py-3 border-color-3 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-2 disabled:opacity-50 disabled:pointer-events-none dark:bg-color-2 dark:text-color-4 font-semibold dark:focus:ring-color-2"
                                                          >
                                                            <option value="">
                                                              --Tipe--
                                                            </option>
                                                            {optionsStok.map(
                                                              (option) => (
                                                                <option
                                                                  key={
                                                                    option.value
                                                                  }
                                                                  value={
                                                                    option.value
                                                                  }
                                                                >
                                                                  {option.text}
                                                                </option>
                                                              )
                                                            )}
                                                          </select>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div className="col-span-5">
                                                      <label
                                                        htmlFor="hs-leading-icon"
                                                        className="block text-md font-medium mb-2 dark:text-color-5"
                                                      >
                                                        Harga Jual{" "}
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
                                                            onKeyDown={
                                                              handleNumInput
                                                            }
                                                            name="h_jual"
                                                            value={
                                                              currentItem.h_jual
                                                            }
                                                            onChange={
                                                              handleChange
                                                            }
                                                            className="py-3 px-4 pe-11  block w-full border-color-3 shadow-sm rounded-e-md text-sm focus:z-10 focus:border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-2"
                                                            placeholder="Masukkan harga jual"
                                                          />
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="mt-5 grid grid-cols-10 gap-3">
                                                    <div className="col-span-5">
                                                      <label
                                                        htmlFor="hs-leading-icon"
                                                        className="block text-md font-medium mb-2 dark:text-color-5"
                                                      >
                                                        Merk{" "}
                                                        <span className="italic text-color-warning">
                                                          *
                                                        </span>
                                                      </label>
                                                      <div className="relative">
                                                        <Select
                                                          value={
                                                            merkOptions.find(
                                                              (option) =>
                                                                option.value ===
                                                                currentItem?.id_merk
                                                            ) || null
                                                          }
                                                          onChange={(
                                                            selectedOption
                                                          ) =>
                                                            handleChangeSelect(
                                                              "id_merk",
                                                              selectedOption
                                                            )
                                                          }
                                                          options={merkOptions}
                                                          className="block w-full  border-color-3 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-2"
                                                          styles={{
                                                            control: (
                                                              base
                                                            ) => ({
                                                              ...base,
                                                              padding: "4px 0",
                                                              borderColor: "",
                                                              boxShadow:
                                                                "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                                                              borderRadius:
                                                                "0.375rem",
                                                              backgroundColor:
                                                                "white",
                                                            }),
                                                            menu: (base) => ({
                                                              ...base,
                                                              maxHeight:
                                                                "200px",
                                                              overflowY: "auto",
                                                            }),
                                                          }}
                                                          placeholder="Pilih Merk"
                                                        />
                                                      </div>
                                                    </div>
                                                    <div className="col-span-5">
                                                      <label
                                                        htmlFor="hs-leading-icon"
                                                        className="block text-md font-medium mb-2 dark:text-color-5"
                                                      >
                                                        Upload Gambar
                                                      </label>
                                                      <div className="relative  rounded-md bg-color-2 ">
                                                        <div className="flex items-center">
                                                          <Zoom>
                                                            <img
                                                              className="w-24 p-1 rounded-s-md border border-color-2 disabled:opacity-50 disabled:pointer-events-none dark:bg-color-2 dark:text-gray-400 dark:focus:ring-color-2"
                                                              src={
                                                                preview === ""
                                                                  ? currentItem.img ===
                                                                    null
                                                                    ? `./src/assets/no-preview.png`
                                                                    : currentItem.img ===
                                                                      ""
                                                                    ? `./src/assets/no-preview.png`
                                                                    : currentItem.img
                                                                  : preview
                                                              }
                                                            />
                                                          </Zoom>

                                                          <input
                                                            type="file"
                                                            name="img"
                                                            // value="./sold"
                                                            onChange={loadImage}
                                                            className="block bg-color-6 mr-2 w-full text-sm text-gray-500 file:me-4 file:py-1.5 file:px-2.5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-color-1 file:text-white hover:file:bg-6hover file:disabled:opacity-50 file:cursor-pointe border-color-3 focus:z-10 focus:border-color-2 dark:focus:ring-color-2"
                                                          />
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="my-5 grid grid-cols-10 gap-3">
                                                    <div className="col-span-5">
                                                      <label
                                                        htmlFor="hs-leading-icon"
                                                        className="block text-md font-medium mb-2 dark:text-color-5"
                                                      >
                                                        Kategori{" "}
                                                        <span className="italic text-color-warning">
                                                          *
                                                        </span>
                                                      </label>
                                                      <div className="relative">
                                                        <Select
                                                          value={
                                                            kategoriOptions.find(
                                                              (option) =>
                                                                option.value ===
                                                                currentItem?.id_kategori
                                                            ) || null
                                                          }
                                                          onChange={(
                                                            selectedOption
                                                          ) =>
                                                            handleChangeSelect(
                                                              "id_kategori",
                                                              selectedOption
                                                            )
                                                          }
                                                          options={
                                                            kategoriOptions
                                                          }
                                                          className="block w-full  border-color-3 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-2"
                                                          styles={{
                                                            control: (
                                                              base
                                                            ) => ({
                                                              ...base,
                                                              padding: "4px 0",
                                                              borderColor: "",
                                                              boxShadow:
                                                                "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                                                              borderRadius:
                                                                "0.375rem",
                                                              backgroundColor:
                                                                "white",
                                                            }),
                                                            menu: (base) => ({
                                                              ...base,
                                                              maxHeight:
                                                                "200px",
                                                              overflowY: "auto",
                                                            }),
                                                          }}
                                                          placeholder="Pilih Kategori"
                                                        />
                                                      </div>
                                                    </div>
                                                    <div className="col-span-5">
                                                      <label
                                                        htmlFor="hs-leading-icon"
                                                        className="block text-md font-medium mb-2 dark:text-color-5"
                                                      >
                                                        Penanggung Jawab{" "}
                                                        <span className="italic text-color-warning">
                                                          *
                                                        </span>
                                                      </label>
                                                      <div className="relative">
                                                        <input
                                                          type="text"
                                                          disabled
                                                          name="users_id"
                                                          value={`${currentItem.f_name} ${currentItem.l_name}`}
                                                          onChange={
                                                            handleChange
                                                          }
                                                          className="py-3 px-4 block w-full border-color-3 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-2"
                                                          placeholder={`${currentItem.f_name} ${currentItem.l_name}`}
                                                        />
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="mt-5 grid grid-cols-10 gap-3">
                                                    <div className="col-span-5">
                                                      <label
                                                        htmlFor="hs-leading-icon"
                                                        className="block text-md font-medium mb-2 dark:text-color-5"
                                                      >
                                                        Ukuran
                                                      </label>
                                                      <div className="relative">
                                                        <Select
                                                          value={
                                                            ukuranOptions.find(
                                                              (option) =>
                                                                option.value ===
                                                                currentItem?.id_ukuran
                                                            ) || null
                                                          }
                                                          onChange={(
                                                            selectedOption
                                                          ) =>
                                                            handleChangeSelect(
                                                              "id_ukuran",
                                                              selectedOption
                                                            )
                                                          }
                                                          options={
                                                            ukuranOptions
                                                          }
                                                          className="block w-full  border-color-3 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-2"
                                                          styles={{
                                                            control: (
                                                              base
                                                            ) => ({
                                                              ...base,
                                                              padding: "4px 0",
                                                              borderColor: "",
                                                              boxShadow:
                                                                "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                                                              borderRadius:
                                                                "0.375rem",
                                                              backgroundColor:
                                                                "white",
                                                            }),
                                                            menu: (base) => ({
                                                              ...base,
                                                              maxHeight:
                                                                "200px",
                                                              overflowY: "auto",
                                                            }),
                                                          }}
                                                          placeholder="Pilih Ukuran"
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
                                                Edit Barang
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
                                  data={barang.length}
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

                        {/* MODALS FORM Tambah */}
                        <div
                          id="hs-tambah-alert"
                          className="hs-overlay hidden w-full h-full fixed top-0 start-0 z-[70] overflow-x-hidden overflow-y-auto"
                        >
                          <div className="hs-overlay-open:mt-10  hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all md:max-w-2xl md:w-full m-3 md:mx-auto">
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

                              <form onSubmit={addBarang}>
                                <div className="p-4 sm:p-10 overflow-y-auto">
                                  <div className="flex gap-x-4 md:gap-x-7">
                                    <div className="grow">
                                      <h3 className="mb-2 text-3xl font-bold text-gray-800 dark:text-gray-700">
                                        Form Tambah Barang
                                      </h3>
                                      <div className="mt-10 grid grid-cols-10 gap-3">
                                        <div className="col-span-5">
                                          <label
                                            htmlFor="hs-leading-icon"
                                            className="block text-md font-medium mb-2 dark:text-color-5"
                                          >
                                            Nama barang{" "}
                                            <span className="italic text-color-warning">
                                              *
                                            </span>
                                          </label>
                                          <div className="relative">
                                            <input
                                              type="text"
                                              name="hs-leading-icon"
                                              value={n_barang}
                                              onChange={(e) =>
                                                setNBarang(e.target.value)
                                              }
                                              className="py-3 px-4 block w-full border-color-3 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-2"
                                              placeholder="Masukkan nama barang"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-span-5">
                                          <label
                                            htmlFor="hs-leading-icon"
                                            className="block text-md font-medium mb-2 dark:text-color-5"
                                          >
                                            Harga Beli{" "}
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
                                                onKeyDown={handleNumInput}
                                                name="hs-input-with-add-on-url"
                                                value={h_beli}
                                                onChange={(e) =>
                                                  setHBeli(e.target.value)
                                                }
                                                className="py-3 px-4 pe-11  block w-full border-color-3 shadow-sm rounded-e-md text-sm focus:z-10 focus:border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-2"
                                                placeholder="Masukkan harga beli"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="mt-5 grid grid-cols-10 gap-3">
                                        <div className="col-span-5">
                                          <label
                                            htmlFor="hs-leading-icon"
                                            className="block text-md font-medium mb-2 dark:text-color-5"
                                          >
                                            Jumlah Stok{" "}
                                            <span className="italic text-color-warning">
                                              *
                                            </span>
                                          </label>
                                          <div className="relative">
                                            <input
                                              type="text"
                                              name="hs-leading-icon"
                                              value={jml_stok}
                                              onChange={(e) =>
                                                setJmlStok(e.target.value)
                                              }
                                              className="py-3 px-4 block w-full border-color-3 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-2"
                                              placeholder="Masukkan jumlah stok"
                                            />
                                            <div className="absolute inset-y-0 end-0 flex items-center text-gray-500 pe-px">
                                              <label
                                                htmlFor="hs-inline-leading-select-currency"
                                                className="sr-only"
                                              >
                                                satuan barang
                                              </label>
                                              <select
                                                id="hs-inline-leading-select-currency"
                                                name="hs-inline-leading-select-currency"
                                                value={tipe_stok}
                                                onChange={handleTipeStok}
                                                className="py-3 border-color-3 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-2 disabled:opacity-50 disabled:pointer-events-none dark:bg-color-2 dark:text-color-4 font-semibold dark:focus:ring-color-2"
                                              >
                                                <option value="">
                                                  --Tipe--
                                                </option>

                                                {optionsStok.map((option) => (
                                                  <option
                                                    key={option.value}
                                                    value={option.value}
                                                  >
                                                    {option.text}
                                                  </option>
                                                ))}
                                              </select>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-span-5">
                                          <label
                                            htmlFor="hs-leading-icon"
                                            className="block text-md font-medium mb-2 dark:text-color-5"
                                          >
                                            Harga Jual{" "}
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
                                                onKeyDown={handleNumInput}
                                                name="hs-input-with-add-on-url"
                                                value={h_jual}
                                                onChange={(e) =>
                                                  setHJual(e.target.value)
                                                }
                                                className="py-3 px-4 pe-11  block w-full border-color-3 shadow-sm rounded-e-md text-sm focus:z-10 focus:border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-2"
                                                placeholder="Masukkan harga jual"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="mt-5 grid grid-cols-10 gap-3">
                                        <div className="col-span-5">
                                          <label
                                            htmlFor="hs-leading-icon"
                                            className="block text-md font-medium mb-2 dark:text-color-5"
                                          >
                                            Merk{" "}
                                            <span className="italic text-color-warning">
                                              *
                                            </span>
                                          </label>
                                          <div className="relative">
                                            <Select
                                              value={
                                                merkOptions.find(
                                                  (option) =>
                                                    option.value ===
                                                    currentItem?.id_merk
                                                ) || null
                                              }
                                              onChange={(selectedOption) =>
                                                handleChangeSelect(
                                                  "id_merk",
                                                  selectedOption
                                                )
                                              }
                                              options={merkOptions}
                                              className="block w-full  border-color-3 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-2"
                                              styles={{
                                                control: (base) => ({
                                                  ...base,
                                                  padding: "4px 0",
                                                  borderColor: "",
                                                  boxShadow:
                                                    "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                                                  borderRadius: "0.375rem",
                                                  backgroundColor: "white",
                                                }),
                                                menu: (base) => ({
                                                  ...base,
                                                  maxHeight: "200px",
                                                  overflowY: "auto",
                                                }),
                                              }}
                                              placeholder="Pilih merk"
                                            />
                                          </div>
                                        </div>
                                        <div className="col-span-5">
                                          <label
                                            htmlFor="hs-leading-icon"
                                            className="block text-md font-medium mb-2 dark:text-color-5"
                                          >
                                            Upload Gambar
                                          </label>
                                          <div className="relative  rounded-md bg-color-2 ">
                                            <div className="flex items-center">
                                              <Zoom>
                                                <img
                                                  className="w-24 p-1 rounded-s-md border border-color-2 disabled:opacity-50 disabled:pointer-events-none dark:bg-color-2 dark:text-gray-400 dark:focus:ring-color-2"
                                                  src={
                                                    preview
                                                      ? preview
                                                      : `./src/assets/no-preview.png`
                                                  }
                                                />
                                              </Zoom>

                                              <input
                                                type="file"
                                                // value={img}
                                                onChange={loadImage}
                                                className="block bg-color-6 mr-2 w-full text-sm text-gray-500 file:me-4 file:py-1.5 file:px-2.5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-color-1 file:text-white hover:file:bg-6hover file:disabled:opacity-50 file:cursor-pointe border-color-3 focus:z-10 focus:border-color-2 dark:focus:ring-color-2"
                                              />
                                              {/* {console.log(preview)} */}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-10 gap-3">
                                        <div className="col-span-5">
                                          <label
                                            htmlFor="hs-leading-icon"
                                            className="block text-md font-medium mb-2 dark:text-color-5"
                                          >
                                            Kategori{" "}
                                            <span className="italic text-color-warning">
                                              *
                                            </span>
                                          </label>
                                          <div className="relative">
                                            <Select
                                              value={
                                                kategoriOptions.find(
                                                  (option) =>
                                                    option.value ===
                                                    currentItem?.id_kategori
                                                ) || null
                                              }
                                              onChange={(selectedOption) =>
                                                handleChangeSelect(
                                                  "id_kategori",
                                                  selectedOption
                                                )
                                              }
                                              options={kategoriOptions}
                                              className="block w-full  border-color-3 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-2"
                                              styles={{
                                                control: (base) => ({
                                                  ...base,
                                                  padding: "4px 0",
                                                  borderColor: "",
                                                  boxShadow:
                                                    "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                                                  borderRadius: "0.375rem",
                                                  backgroundColor: "white",
                                                }),
                                                menu: (base) => ({
                                                  ...base,
                                                  maxHeight: "200px",
                                                  overflowY: "auto",
                                                }),
                                              }}
                                              placeholder="Pilih Kategori"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="mt-5 grid grid-cols-10 gap-3">
                                        <div className="col-span-5">
                                          <label
                                            htmlFor="hs-leading-icon"
                                            className="block text-md font-medium mb-2 dark:text-color-5"
                                          >
                                            Ukuran
                                          </label>
                                          <div className="relative">
                                            <Select
                                              value={
                                                ukuranOptions.find(
                                                  (option) =>
                                                    option.value ===
                                                    currentItem?.id_ukuran
                                                ) || null
                                              }
                                              onChange={(selectedOption) =>
                                                handleChangeSelect(
                                                  "id_ukuran",
                                                  selectedOption
                                                )
                                              }
                                              options={ukuranOptions}
                                              className="block w-full  border-color-3 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-2"
                                              styles={{
                                                control: (base) => ({
                                                  ...base,
                                                  padding: "4px 0",
                                                  borderColor: "",
                                                  boxShadow:
                                                    "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                                                  borderRadius: "0.375rem",
                                                  backgroundColor: "white",
                                                }),
                                                menu: (base) => ({
                                                  ...base,
                                                  maxHeight: "200px",
                                                  overflowY: "auto",
                                                }),
                                              }}
                                              placeholder="Pilih Ukuran"
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
                                    Tambah Barang
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

export default KelolaBarang;
