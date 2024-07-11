const query = require("../database");

const getPengeluaran = async (req, res) => {
  try {
    const data = await query(
      `SELECT pengeluaran, tgl, nama, qty, pengeluaran, updated_at
       FROM pengeluaran 
       ORDER BY updated_at DESC`
    );

    return res.status(200).json({
      success: true,
      message: "Menampilkan seluruh Data Pengeluaran",
      data: data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Data Pengeluaran tidak ditemukan / Gagal",
    });
  }
};

const createPengeluaran = async (req, res) => {
  const { tgl, barang_id, qty, pengeluaran } = req.body;

  if (pengeluaran === undefined || pengeluaran === "")
    return res.status(400).json({
      success: false,
      message: "Nama Merk wajib di isi!",
    });

  if (qty === undefined || qty === "")
    return res.status(400).json({
      success: false,
      message: "QTY wajib di isi!",
    });

  try {
    const { resultId: id } = await query(
      "INSERT INTO pengeluaran(tgl, nama, qty, pengeluaran) VALUES(?,?,?,?)",
      [tgl, barang_id, qty, pengeluaran]
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
  createPengeluaran,
  deletePengeluaran,
};
