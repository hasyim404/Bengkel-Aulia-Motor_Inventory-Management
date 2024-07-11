const query = require("../database");

const getPengeluaran = async (req, res) => {
  try {
    const { start, end } = req.query;

    let queryStr = "SELECT * FROM pengeluaran";
    let queryParams = [];

    if (start && end) {
      queryStr += " WHERE tgl BETWEEN ? AND ?";
      queryParams.push(start, end);
    }

    queryStr += " ORDER BY tgl DESC";

    const data = await query(queryStr, queryParams);

    return res.status(200).json({
      success: true,
      message: "Menampilkan seluruh Data Pemasukan",
      data: data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Data Pengeluaran tidak ditemukan / Gagal",
    });
  }
};

const findPengeluaranById = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await query(`SELECT * FROM Pengeluaran WHERE id = ?`, [id]);

    if (data.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Data Pengeluaran berhasil ditemukan",
        data: data,
      });
    } else
      res.status(400).json({
        success: false,
        message: "Data Pengeluaran tidak ditemukan! / Gagal",
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const createPengeluaran = async (req, res) => {
  const { tgl, nama, qty, pengeluaran } = req.body;

  if (tgl === undefined || tgl === "")
    return res.status(400).json({
      success: false,
      message: "Tanggal wajib di isi!",
    });

  if (nama === undefined || nama === "")
    return res.status(400).json({
      success: false,
      message: "Kolom Barang / Layanan wajib di isi!",
    });

  if (pengeluaran === undefined || pengeluaran === "")
    return res.status(400).json({
      success: false,
      message: "Kolom pemasukan wajib di isi!",
    });

  if (qty === undefined || qty === "")
    return res.status(400).json({
      success: false,
      message: "QTY wajib di isi!",
    });

  try {
    const { resultId: id } = await query(
      "INSERT INTO pengeluaran(tgl, nama, qty, pengeluaran) VALUES(?,?,?,?)",
      [tgl, nama, qty, pengeluaran]
    );

    return res.status(200).json({
      success: true,
      message: "Data Pengeluaran berhasil ditambahkan!",
      data: { id, ...req.body },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Data Pengeluaran Gagal ditambahkan",
    });
  }
};

const deletePengeluaran = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await query("DELETE FROM pengeluaran WHERE id = ?", [id]);

    if (data.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        message: "Data Pengeluaran berhasil dihapus!",
      });
    } else
      res.status(400).json({
        success: false,
        message: "Data Pengeluaran tidak ditemukan! / Gagal",
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = {
  getPengeluaran,
  findPengeluaranById,
  createPengeluaran,
  deletePengeluaran,
};
