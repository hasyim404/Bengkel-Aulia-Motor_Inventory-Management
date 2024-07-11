const express = require("express");
const routes = express();
const {
  getPengeluaran,
  createPengeluaran,
  deletePengeluaran,
} = require("../controller/PengeluaranController");

routes.get("/pengeluaran", getPengeluaran);

module.exports = routes;
