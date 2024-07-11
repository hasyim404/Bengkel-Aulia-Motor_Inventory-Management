const express = require("express");
const app = express();

const users = require("./UserRoute");
const barang = require("./BarangRoute");
const kategori = require("./KategoriRoute");
const merk = require("./MerkRoute");
const ukuran = require("./UkuranRoute");
const pengeluaran = require("./PengeluaranRoute");
const pemasukan = require("./PemasukanRoute");
const auth = require("./auth/AuthRoute");

const apiUrl = "/api/v1";

app.use(apiUrl, users);
app.use(apiUrl, barang);
app.use(apiUrl, kategori);
app.use(apiUrl, merk);
app.use(apiUrl, ukuran);
app.use(apiUrl, pengeluaran);
app.use(apiUrl, pemasukan);
app.use(apiUrl, auth);

module.exports = app;
