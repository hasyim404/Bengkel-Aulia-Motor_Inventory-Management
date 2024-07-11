const query = require("../database");

const getPemasukan = async (req, res) => {
  try {
    const data = await query(
      "SELECT * FROM pemasukan ORDER BY updated_at DESC"
    );

    return res.status(200).json({
      success: true,
      message: "Menampilkan seluruh Data Pemasukan",
      data: data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Data Pemasukan tidak ditemukan / Gagal",
    });
  }
};

const createPemasukan = async (req, res) => {
  const { tgl, barang_id, qty, pemasukan } = req.body;

  if (pemasukan === undefined || pemasukan === "")
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
      "INSERT INTO pemasukan(tgl, barang_id, qty, pemasukan) VALUES(?,?,?,?)",
      [tgl, barang_id, qty, pemasukan]
    );

    return res.status(200).json({
      success: true,
      message: "Data Pemasukan berhasil ditambahkan!",
      data: { id, ...req.body },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Data Pemasukan Gagal ditambahkan",
    });
  }
};

const deletePemasukan = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await query("DELETE FROM pemasukan WHERE id = ?", [id]);

    if (data.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        message: "Data Pemasukan berhasil dihapus!",
      });
    } else
      res.status(400).json({
        success: false,
        message: "Data Pemasukan tidak ditemukan! / Gagal",
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = {
  getPemasukan,
  createPemasukan,
  deletePemasukan,
};
