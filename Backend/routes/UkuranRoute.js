const express = require("express");
const routes = express();
const {
  getUkuran,
  findUkuranById,
  createUkuran,
  updateUkuran,
  deleteUkuran,
} = require("../controller/UkuranController");

routes.get("/ukuran", getUkuran);
routes.get("/ukuran/:id", findUkuranById);
routes.post("/ukuran", createUkuran);
routes.put("/ukuran/:id", updateUkuran);
routes.delete("/ukuran/:id", deleteUkuran);

module.exports = routes;
