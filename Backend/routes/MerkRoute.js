const express = require("express");
const routes = express();
const {
  getMerk,
  findMerkById,
  createMerk,
  updateMerk,
  deleteMerk,
} = require("../controller/MerkController");

routes.get("/merk", getMerk);
routes.get("/merk/:id", findMerkById);
routes.post("/merk", createMerk);
routes.put("/merk/:id", updateMerk);
routes.delete("/merk/:id", deleteMerk);

module.exports = routes;
