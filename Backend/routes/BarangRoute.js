const express = require("express");
const routes = express();
const {
  getBarang,
  findBarangById,
  createBarang,
  updateBarang,
  deleteBarang,
} = require("../controller/BarangController");

routes.get("/barang", getBarang);
routes.get("/barang/:id", findBarangById);
routes.post("/barang", createBarang);
routes.put("/barang/:id", updateBarang);
routes.delete("/barang/:id", deleteBarang);

module.exports = routes;
