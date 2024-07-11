import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

import Swal from "sweetalert2";
import ModalImage from "react-modal-image";

import MainTitle from "../../components/MainTitle";
import Navbar from "../../components/Navbar/Navbar";
import { useUser } from "../../context/UserContext";
import noPreview from "../../assets/no-preview.png";

const EditKelolaBarang = () => {
  const { checkRoleAndNavigate, getUserData } = useUser();
  const navigate = useNavigate();
  const data = getUserData();

  const { id } = useParams();
  const [barang, setBarang] = useState({});

  const [n_barang, setNBarang] = useState("");
  const [jml_stok, setJmlStok] = useState("");
  const [h_beli, setHBeli] = useState("");
  const [h_jual, setHJual] = useState("");
  const [img, setImg] = useState("");
  const [merk_id, setMerkId] = useState("");
  const [kategori_id, setKategoriId] = useState("");
  const [ukuran_id, setUkuranId] = useState("");
  const [tipe_stok, setTipeStok] = useState("");
  const [users_id, setUsersId] = useState([data.id]);
  const optionsStok = [
    { value: "pcs", text: "-/pcs" },
    { value: "paket", text: "-/paket" },
    { value: "set", text: "-/set" },
    { value: "lusin", text: "-/lusin" },
    { value: "-", text: "-/-" },
  ];
  const [merkIdOptions, setMerkIdOptions] = useState([]);
  const [kategoriIdOptions, setKategoriIdOptions] = useState([]);
  const [ukuranIdOptions, setUkuranIdOptions] = useState([]);

  const getBarang = async () => {
    const response = await axios.get("http://localhost:1023/api/v1/barang");
    setBarang(response.data.data[0]);
  };

  useEffect(() => {
    // Fetch data for the selected barang based on the ID
    const allowed = checkRoleAndNavigate(["pemilik", "karyawan"], navigate);

    if (!allowed) {
      //
    }

    getBarang();

    const fetchBarang = async () => {
      try {
        const response = await axios.get(
          `http://localhost:1023/api/v1/barang/${id}`
        );
        const barangData = response.data.data[0];

        setNBarang(barangData.n_barang);
        setJmlStok(barangData.jml_stok);
        setHBeli(barangData.h_beli);
        setHJual(barangData.h_jual);
        setMerkId(barangData.merk_id);
        setImg(barangData.img);
        setKategoriId(barangData.kategori_id);
        setUkuranId(barangData.ukuran_id);
        setUsersId(barangData.users_id);
        setTipeStok(barangData.tipe_stok);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Fetch merk, kategori, and ukuran options
    const fetchOptions = async () => {
      try {
        const [merkResponse, kategoriResponse, ukuranResponse] =
          await Promise.all([
            axios.get("http://localhost:1023/api/v1/merk"),
            axios.get("http://localhost:1023/api/v1/kategori"),
            axios.get("http://localhost:1023/api/v1/ukuran"),
          ]);

        setMerkIdOptions(merkResponse.data.data);
        setKategoriIdOptions(kategoriResponse.data.data);
        setUkuranIdOptions(ukuranResponse.data.data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchBarang();
    fetchOptions();
  }, [navigate, id]);

  const handleTipeStok = (e) => {
    setTipeStok(e.target.value);
  };

  const editData = async (e) => {
    e.preventDefault();

    // Perform the update API request
    try {
      await axios.put(`http://localhost:1023/api/v1/barang/${id}`, {
        n_barang,
        jml_stok,
        h_beli,
        h_jual,
        merk_id,
        img,
        kategori_id,
        ukuran_id,
        users_id: data.id,
        tipe_stok,
      });
      Swal.fire({
        title: "Edit Data barang Berhasil!",
        text: "Berhasil edit barang ukuran!",
        icon: "success",
      });
      navigate("/kelola-barang");
    } catch (error) {
      console.error("Error updating data:", error);
      Swal.fire({
        title: "Gagal edit barang!",
        text: "Gagal edit data barang~",
        icon: "error",
      });
    }
  };

  return (
    <>
      <Navbar active1="active" />
      <div className="w-full pt-10 pb-20 px-4 sm:px-6 md:px-8 lg:ps-72">
        <div className="px-44 py-5">
          <MainTitle size="text-3xl" main="Kelola Barang" />
          <p className="text-md font-normal text-color-4">
            <Link color="text-color-4" to="/dashboard">
              Dashboard{" "}
            </Link>
            /{" "}
            <Link color="text-color-4" to="/kelola-barang">
              Kelola Barang{" "}
            </Link>
            /{" "}
            <span color="text-color-5" className="italic">
              Edit Barang
            </span>
          </p>
        </div>

        {/* Content */}
        <div className="">
          <form onSubmit={editData}>
            <div className="px-44 py-5">
              <div className="flex p-5 gap-x-4 md:gap-x-7 bg-color-6 shadow-lg rounded-xl">
                <div className="grow">
                  <div className="mt-10 grid grid-cols-10 gap-3">
                    <div className="col-span-5">
                      <label
                        htmlFor="hs-leading-icon"
                        className="block text-md font-medium mb-2 dark:text-color-5"
                      >
                        Nama barang{" "}
                        <span className="italic text-color-warning">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="n_barang"
                          value={n_barang}
                          onChange={(e) => setNBarang(e.target.value)}
                          className="py-3 px-4 block w-full border-color-3 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-2"
                          placeholder="Masukkan nama barang..."
                        />
                      </div>
                    </div>
                    <div className="col-span-5">
                      <label
                        htmlFor="hs-leading-icon"
                        className="block text-md font-medium mb-2 dark:text-color-5"
                      >
                        Harga Beli{" "}
                        <span className="italic text-color-warning">*</span>
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
                            name="h_beli"
                            value={h_beli}
                            onChange={(e) => setHBeli(e.target.value)}
                            className="py-3 px-4 pe-11  block w-full border-color-3 shadow-sm rounded-e-md text-sm focus:z-10 focus:border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-2"
                            placeholder="..."
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
                        <span className="italic text-color-warning">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="jml_stok"
                          value={jml_stok}
                          onChange={(e) => setJmlStok(e.target.value)}
                          className="py-3 px-4 block w-full border-color-3 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-2"
                          placeholder="30"
                        />
                        <div className="absolute inset-y-0 end-0 flex items-center text-gray-500 pe-px">
                          <label
                            htmlFor="hs-inline-leading-select-currency"
                            className="sr-only"
                          >
                            satuan barang
                          </label>
                          <select
                            name="tipe_stok"
                            value={tipe_stok}
                            onChange={handleTipeStok}
                            className="py-3 pl-7 border-color-3 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-2 disabled:opacity-50 disabled:pointer-events-none dark:bg-color-2 dark:text-color-4 font-semibold dark:focus:ring-color-2"
                          >
                            {optionsStok.map((tipe) => (
                              <option key={tipe.value} value={tipe.value}>
                                {tipe.text}
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
                        <span className="italic text-color-warning">*</span>
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
                            name="h_jual"
                            value={h_jual}
                            onChange={(e) => setHJual(e.target.value)}
                            className="py-3 px-4 pe-11  block w-full border-color-3 shadow-sm rounded-e-md text-sm focus:z-10 focus:border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-2"
                            placeholder="..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-10 gap-3 mb-5">
                    <div className="col-span-5">
                      <label
                        htmlFor="hs-leading-icon"
                        className="block text-md font-medium mb-2 dark:text-color-5"
                      >
                        Merk{" "}
                        <span className="italic text-color-warning">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="merk_id"
                          value={merk_id}
                          onChange={(e) => setMerkId(e.target.value)}
                          className="py-3 px-4 pe-9 block w-full  border-color-3 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-2"
                        >
                          <option value="DEFAULT">Pilih merk</option>
                          {merkIdOptions.map((merk) => (
                            <option key={merk.id} value={merk.id}>
                              {merk.n_merk}
                            </option>
                          ))}
                        </select>
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
                          <ModalImage
                            className="w-24 p-1 rounded-s-md border border-color-2 disabled:opacity-50 disabled:pointer-events-none dark:bg-color-2 dark:text-gray-400 dark:focus:ring-color-2"
                            small={
                              img !== ""
                                ? `/src/assets/${img}`
                                : `/src/assets/no-preview.png`
                            }
                            medium={
                              img !== ""
                                ? `/src/assets/${img}`
                                : `/src/assets/no-preview.png`
                            }
                            hideDownload
                          />

                          <input
                            type="file"
                            name="img"
                            className="block bg-color-6 mr-2 w-full text-sm text-gray-500 file:me-4 file:py-1.5 file:px-2.5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-color-1 file:text-white hover:file:bg-6hover file:disabled:opacity-50 file:cursor-pointe border-color-3 focus:z-10 focus:border-color-2 dark:focus:ring-color-2"
                          />
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
                        <span className="italic text-color-warning">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="kategori_id"
                          value={kategori_id}
                          onChange={(e) => setKategoriId(e.target.value)}
                          className="py-3 px-4 pe-9 block w-full rounded-lg border-color-3 shadow-sm text-sm focus:z-10 focus:border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-2"
                        >
                          <option value="DEFAULT">Pilih Kategori</option>
                          {kategoriIdOptions.map((kategori) => (
                            <option key={kategori.id} value={kategori.id}>
                              {kategori.n_kategori}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-span-5">
                      <label
                        htmlFor="hs-leading-icon"
                        className="block text-md font-medium mb-2 dark:text-color-5"
                      >
                        Penanggung Jawab{" "}
                        <span className="italic text-color-warning">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          disabled
                          className="py-3 px-4 block w-full border-color-3 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-2"
                          placeholder={`${barang.f_name} ${barang.l_name}`}
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
                        <select
                          name="ukuran_id"
                          value={ukuran_id}
                          onChange={(e) => setUkuranId(e.target.value)}
                          className="py-3 px-4 pe-9 block w-full rounded-lg border-color-3 shadow-sm text-sm focus:z-10 focus:border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-2"
                        >
                          <option value="DEFAULT">Pilih Ukuran</option>
                          {ukuranIdOptions.map((ukuran) => (
                            <option key={ukuran.id} value={ukuran.id}>
                              {ukuran.n_ukuran}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-60 py-5">
              <div className="flex justify-end items-center gap-x-2 py-3 px-4 ">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="py-2 px-5 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-color-5  shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-zinc-200 dark:border-color-5dark:text-color-5 dark:hover:bg-zinc-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-color-5"
                >
                  Kembali
                </button>
                <button className="py-2 px-8 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50 disabled:pointer-events-none ">
                  Edit Barang
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* MODALS FORM EDIT */}
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
          </div>
        </div>
      </div>
    </>
  );
};

export default EditKelolaBarang;
