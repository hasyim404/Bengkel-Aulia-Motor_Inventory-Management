const express = require("express");
const routes = express();
const {
  getPengeluaran,
  findPengeluaranById,
  createPengeluaran,
  deletePengeluaran,
  namePDF,
  exportPDF,
} = require("../controller/PengeluaranController");

routes.get("/pengeluaran", getPengeluaran);
routes.get("/pengeluaran/:id", findPengeluaranById);
routes.post("/pengeluaran", createPengeluaran);
routes.delete("/pengeluaran/:id", deletePengeluaran);
routes.get("/pengeluaran/pdf/download", exportPDF);
routes.get("/pengeluaran/pdf/name", namePDF);

module.exports = routes;
