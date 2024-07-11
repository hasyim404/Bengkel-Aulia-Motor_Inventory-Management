import "./index.css";

import React from "react";
import "react-medium-image-zoom/dist/styles.css";
// import "../node_modules/preline/dist/preline.js";

import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import("preline");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
