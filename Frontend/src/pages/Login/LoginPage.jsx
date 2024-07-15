import React, { useEffect } from "react";
import Login from "../../components/Login/Login";
import { Helmet } from "react-helmet-async";

const LoginPage = () => {
  useEffect(() => {
    document.body.style.backgroundColor = "#078080";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Login | Aulia Motor</title>
      </Helmet>

      <section id="login-page">
        <Login />
      </section>
    </>
  );
};

export default LoginPage;
