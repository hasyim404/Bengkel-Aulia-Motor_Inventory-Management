import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import ENDPOINTS from "../../utils/constants/constant";

const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(ENDPOINTS.LOGIN, {
        email,
        password,
      });

      return { token: response.data.token, data: response.data.data };
    } catch (error) {
      throw error;
    }
  },
};

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        handleLogin(event);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [email, password]);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      if (!email || !password) {
        Swal.fire({
          title: "Login Gagal!",
          html: "Email dan Password tidak<br>boleh Kosong!",
          icon: "error",
        });
        return;
      }

      const response = await authService.login(email, password);
      const { token, data } = response;

      localStorage.setItem("token", token);
      localStorage.setItem("data", JSON.stringify(data));

      Swal.fire({
        title: "Login Berhasil!",
        html: `Selamat datang ${data.f_name} ${data.l_name}`,
        icon: "success",
      }).then(() => {
        navigate("/dashboard");
        window.location.reload();
      });
    } catch (error) {
      if (error.response) {
        Swal.fire({
          title: "Login Gagal!",
          text: "Email atau Password salah",
          icon: "error",
        });
      } else if (error.request) {
        Swal.fire({
          title: "Login Gagal!",
          text: "Tidak dapat terhubung ke server",
          icon: "error",
        });
      } else {
        Swal.fire({
          title: "Login Gagal!",
          text: "Terjadi kesalahan",
          icon: "error",
        });
      }
    }
  };

  return (
    <>
      <div className="login lg:px-0 lg:py-1 h-full w-full flex items-center justify-center">
        <div className="mx-20 my-10">
          <div className="box-content h-full w-full flex flex-col bg-white shadow-md rounded-3xl hover:shadow-md transitioncol-span-2">
            <div className="">
              <div className="grid grid-cols-12">
                <div className="bg-color-6 col-span-5 p-10 rounded-l-3xl">
                  <div className="border-4 border-color-1 rounded-2xl py-10 px-10 border-w">
                    <img
                      className="w-80 h-auto m-auto"
                      src="./src/assets/main-logo.svg"
                      alt="Logo"
                    />
                    <div className="relative flex py-5 items-center">
                      <div className="flex-grow border-t border-color-1 border-2"></div>
                    </div>

                    <form>
                      <div className="lg:mx-auto lg:me-0">
                        <div className="text-center">
                          <div className="text-center">
                            <h1 className="font-bold text-2xl">Masuk</h1>
                            <p>Untuk mulai management barang</p>
                          </div>
                        </div>

                        <div className="mt-10">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-full">
                              <div className="relative">
                                <div className="flex rounded-lg shadow-sm">
                                  <div className="px-5 inline-flex items-center min-w-fit rounded-s-md border border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-3 dark:text-gray-400 dark:focus:ring-color-2">
                                    <span className="text-sm text-color-4 font-semibold">
                                      <FontAwesomeIcon icon={faEnvelope} />
                                    </span>
                                  </div>

                                  <input
                                    id="hs-hero-signup-form-floating-input-new-password"
                                    className="peer ps-2 p-4 block w-full border-color-3 rounded-r-lg text-sm placeholder:text-transparent focus:border-color-2 focus:ring-color-2 disabled:opacity-50 disabled:pointer-events-none dark:bg-color-3 dark:border-color-2 dark:text-gray-400 dark:focus:ring-color-2 focus:pt-6 focus:pb-2 [&:not(:placeholder-shown)]:pt-6 [&:not(:placeholder-shown)]:pb-2 autofill:pt-6 autofill:pb-2"
                                    placeholder="admin@gmail.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                  />
                                  <label
                                    htmlFor="hs-hero-signup-form-floating-input-new-password"
                                    className="ps-16 absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent dark:color-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:text-xs peer-focus:-translate-y-1.5 peer-focus:text-gray-500 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1.5 peer-[:not(:placeholder-shown)]:text-gray-500"
                                  >
                                    Email
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div className="col-span-full">
                              <div className="relative">
                                <div className="flex rounded-lg shadow-sm">
                                  <div className="px-5 inline-flex items-center min-w-fit rounded-s-md border border-color-2  disabled:opacity-50 disabled:pointer-events-none dark:bg-color-3 dark:text-gray-400 dark:focus:ring-color-2">
                                    <span className="text-sm text-color-4 font-semibold">
                                      <FontAwesomeIcon
                                        className="ml-0.5"
                                        icon={faLock}
                                      />
                                    </span>
                                  </div>

                                  <input
                                    className="peer ps-2 p-4 block w-full border-color-3 rounded-r-lg text-sm placeholder:text-transparent focus:border-color-2 focus:ring-color-2 disabled:opacity-50 disabled:pointer-events-none dark:bg-color-3 dark:border-color-2 dark:text-gray-400 dark:focus:ring-color-2 focus:pt-6 focus:pb-2 [&:not(:placeholder-shown)]:pt-6 [&:not(:placeholder-shown)]:pb-2 autofill:pt-6 autofill:pb-2"
                                    placeholder="********"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                      setPassword(e.target.value)
                                    }
                                    autoComplete="on"
                                  />
                                  <label className="ps-16 absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent dark:color-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none peer-focus:text-xs peer-focus:-translate-y-1.5 peer-focus:text-gray-500 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-translate-y-1.5 peer-[:not(:placeholder-shown)]:text-gray-500">
                                    Password
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-8">
                            <button
                              type="button"
                              onClick={handleLogin}
                              className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-md font-semibold rounded-lg border border-transparent bg-color-1 text-color-6 hover:bg-6hover disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                            >
                              Login
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="bg-color-3 col-span-7 p-10 rounded-r-3xl flex justify-center items-center">
                  <img
                    className="w-100 h-auto m-auto p-10"
                    src="./src/assets/login-img.svg"
                    alt="add-img"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
