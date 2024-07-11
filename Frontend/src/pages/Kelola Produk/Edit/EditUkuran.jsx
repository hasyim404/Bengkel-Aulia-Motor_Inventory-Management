import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

import Swal from "sweetalert2";

import Navbar from "../../../components/Navbar/Navbar";
import MainTitle from "../../../components/MainTitle";
import { useUser } from "../../../context/UserContext";

const EditUkuran = () => {
  const { checkRoleAndNavigate } = useUser();
  const navigate = useNavigate();

  const { id } = useParams();
  const [ukuran, setUkuran] = useState({});

  const [n_ukuran, setNUkuran] = useState("");
  const [catatan, setCatatan] = useState("");

  useEffect(() => {
    const allowed = checkRoleAndNavigate(["pemilik", "karyawan"], navigate);

    if (!allowed) {
      //
    }

    const getUkuran = async () => {
      try {
        const response = await fetch(
          `http://localhost:1023/api/v1/ukuran/${id}`
        );
        const data = await response.json();
        setUkuran(data.data[0] || "");
        setNUkuran(data.data[0].n_ukuran || "");
        setCatatan(data.data[0].catatan || "");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getUkuran();
  }, [navigate, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "n_ukuran") {
      setNUkuran(value);
    } else if (name === "catatan") {
      setCatatan(value);
    } else {
      setUkuran((prevUkuran) => ({
        ...prevUkuran,
        [name]: value,
      }));
    }
  };

  const editData = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:1023/api/v1/ukuran/${id}`, {
        n_ukuran,
        catatan,
      });

      Swal.fire({
        title: "Edit Data Ukuran Berhasil!",
        text: "Berhasil edit data ukuran!",
        icon: "success",
      });
      navigate("/kelola-produk/ukuran");
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Gagal edit data!",
        text: "Gagal edit data ukuran",
        icon: "error",
      });
    }
  };

  return (
    <>
      <Navbar active="active" display="block" />
      <div className="w-full pt-10 pb-20 px-4 sm:px-6 md:px-8 lg:ps-72">
        <div className="px-60 py-5">
          <MainTitle size="text-3xl" main="Kelola Ukuran" />
          <p className="text-md font-normal text-color-4">
            <Link color="text-color-4" to="/dashboard">
              Dashboard{" "}
            </Link>
            /{" "}
            <Link color="text-color-4" to="/kelola-ukuran">
              Kelola Ukuran{" "}
            </Link>
            /{" "}
            <span color="text-color-5" className="italic">
              Edit Ukuran
            </span>
          </p>
        </div>

        {/* Content */}
        <div className="">
          <form onSubmit={editData}>
            <div className="px-60 py-5">
              <div className="flex p-5 gap-x-4 md:gap-x-7 bg-color-6 shadow-lg rounded-xl">
                <div className="grow">
                  <div className="grid grid-cols-10 gap-3">
                    <div className="col-span-10">
                      <label
                        htmlFor="hs-leading-icon"
                        className="block text-md font-medium mb-2 dark:text-color-5"
                      >
                        Nama Ukuran{" "}
                        <span className="italic text-color-warning">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="n_ukuran"
                          className="py-3 px-4 block w-full border-color-3 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-2"
                          value={n_ukuran}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-10 gap-3">
                    <div className="grid grid-cols-10 gap-3">
                      <div className="col-span-10">
                        <label
                          htmlFor="hs-leading-icon"
                          className="block text-md font-medium mb-2 dark:text-color-5"
                        >
                          Catatan
                        </label>
                        <div className="relative">
                          <textarea
                            className=" border-color-3 shadow-sm rounded-lg text-sm focus:z-10 focus:border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-6 dark:text-gray-400 dark:focus:ring-color-2"
                            id=""
                            cols="73"
                            rows="5"
                            name="catatan"
                            value={catatan}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
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
                  Edit Ukuran
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditUkuran;
