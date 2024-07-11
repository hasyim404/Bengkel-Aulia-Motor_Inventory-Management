const express = require("express");
const routes = express();
const {
  getKategori,
  findKategoriById,
  createKategori,
  updateKategori,
  deleteKategori,
} = require("../controller/KategoriController");

routes.get("/kategori", getKategori);
routes.get("/kategori/:id", findKategoriById);
routes.post("/kategori", createKategori);
routes.put("/kategori/:id", updateKategori);
routes.delete("/kategori/:id", deleteKategori);

module.exports = routes;
