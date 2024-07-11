import React, { useEffect } from "react";
import Login from "../../components/Login/Login";

const LoginPage = () => {
  useEffect(() => {
    document.body.style.backgroundColor = "#078080";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <section id="login-page">
      <Login />
    </section>
  );
};

export default LoginPage;
