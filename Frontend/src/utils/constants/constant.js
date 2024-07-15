const BASE_URL = "http://localhost:1023/api/v1";

const ENDPOINTS = {
  // USER ENDPOINTS
  USERS: `${BASE_URL}/users`,
  USERS_ID: function (id) {
    return `${BASE_URL}/users/${id}`;
  },

  // BARANG ENDPOINTS
  BARANG: `${BASE_URL}/barang`,
  BARANG_ID: function (id) {
    return `${BASE_URL}/barang/${id}`;
  },
  BARANG_PDF_DOWNLOAD: `${BASE_URL}/barang/pdf/download`,
  BARANG_PDF_NAME: `${BASE_URL}/barang/pdf/name`,

  // KATEGORI ENDPOINTS
  KATEGORI: `${BASE_URL}/kategori`,
  KATEGORI_ID: function (id) {
    return `${BASE_URL}/kategori/${id}`;
  },

  // MERK ENDPOINTS
  MERK: `${BASE_URL}/merk`,
  MERK_ID: function (id) {
    return `${BASE_URL}/merk/${id}`;
  },

  // UKURAN ENDPOINTS
  UKURAN: `${BASE_URL}/ukuran`,
  UKURAN_ID: function (id) {
    return `${BASE_URL}/ukuran/${id}`;
  },

  // PENGELUARAN ENDPOINTS
  PENGELUARAN: `${BASE_URL}/pengeluaran`,
  PENGELUARAN_ID: function (id) {
    return `${BASE_URL}/pengeluaran/${id}`;
  },
  PENGELUARAN_PDF_DOWNLOAD: `${BASE_URL}/pengeluaran/pdf/download`,
  PENGELUARAN_PDF_NAME: `${BASE_URL}/pengeluaran/pdf/name`,

  // PEMASUKAN ENDPOINTS
  PEMASUKAN: `${BASE_URL}/pemasukan`,
  PEMASUKAN_ID: function (id) {
    return `${BASE_URL}/pemasukan/${id}`;
  },
  PEMASUKAN_PDF_DOWNLOAD: `${BASE_URL}/pemasukan/pdf/download`,
  PEMASUKAN_PDF_NAME: `${BASE_URL}/pemasukan/pdf/name`,

  // AUTH ENDPOINTS
  REGISTER: `${BASE_URL}/register`,
  LOGIN: `${BASE_URL}/login`,
};

export default ENDPOINTS;
