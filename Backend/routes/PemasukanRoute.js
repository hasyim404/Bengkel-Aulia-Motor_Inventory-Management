const express = require("express");
const routes = express();
const {
  getPemasukan,
  findPemasukanById,
  createPemasukan,
  deletePemasukan,
  namePDF,
  exportPDF,
} = require("../controller/PemasukanController");

routes.get("/pemasukan", getPemasukan);
routes.get("/pemasukan/:id", findPemasukanById);
routes.post("/pemasukan", createPemasukan);
routes.delete("/pemasukan/:id", deletePemasukan);
routes.get("/pemasukan/pdf/download", exportPDF);
routes.get("/pemasukan/pdf/name", namePDF);

module.exports = routes;
