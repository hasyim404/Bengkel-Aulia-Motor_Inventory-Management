import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // localStorage.removeItem("token");

    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan keluar.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, keluar!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Hapus token dari localStorage
        localStorage.removeItem("token");

        // Tampilkan pesan keberhasilan
        Swal.fire({
          title: "Logout Berhasil!",
          icon: "success",
        }).then(() => {
          navigate("/login");
          window.location.reload();
        });
      }
    });
  };

  return (
    <>
      <button
        className="flex w-full items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-color-6 hover:bg-red-500 bg-red-600 dark:hover:text-white-300"
        type="button"
        onClick={handleLogout}
      >
        <FontAwesomeIcon
          icon={faRightFromBracket}
          className="flex-shrink-0 w-4 h-4"
        />
        Log Out
      </button>
    </>
  );
};

export default Logout;
