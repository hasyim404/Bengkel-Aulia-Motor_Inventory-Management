const express = require("express");
const routes = express();
const {
  getPemasukan,
  findPemasukanById,
  createPemasukan,
  deletePemasukan,
} = require("../controller/PemasukanController");

routes.get("/pemasukan", getPemasukan);
routes.get("/pemasukan/:id", findPemasukanById);
routes.post("/pemasukan", createPemasukan);
routes.delete("/pemasukan/:id", deletePemasukan);

module.exports = routes;
