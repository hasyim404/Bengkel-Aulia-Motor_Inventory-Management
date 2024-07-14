const express = require("express");
const routes = express();
const {
  getBarang,
  findBarangById,
  createBarang,
  updateBarang,
  deleteBarang,
  namePDF,
  exportPDF,
} = require("../controller/BarangController");

routes.get("/barang", getBarang);
routes.get("/barang/:id", findBarangById);
routes.post("/barang", createBarang);
routes.put("/barang/:id", updateBarang);
routes.delete("/barang/:id", deleteBarang);
routes.get("/barang/pdf/download", exportPDF);
routes.get("/barang/pdf/name", namePDF);

module.exports = routes;
