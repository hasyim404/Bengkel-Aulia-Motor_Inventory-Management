const express = require("express");
const routes = express();
const {
  getPengeluaran,
  findPengeluaranById,
  createPengeluaran,
  deletePengeluaran,
} = require("../controller/PengeluaranController");

routes.get("/pengeluaran", getPengeluaran);
routes.get("/pengeluaran/:id", findPengeluaranById);
routes.post("/pengeluaran", createPengeluaran);
routes.delete("/pengeluaran/:id", deletePengeluaran);

module.exports = routes;
