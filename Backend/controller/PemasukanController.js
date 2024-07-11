const query = require("../database");

const getPemasukan = async (req, res) => {
  try {
    const { start, end } = req.query;

    let queryStr = "SELECT * FROM pemasukan";
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
      message: "Data Pemasukan tidak ditemukan / Gagal",
    });
  }
};

const findPemasukanById = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await query(`SELECT * FROM pemasukan WHERE id = ?`, [id]);

    if (data.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Data Pemasukan berhasil ditemukan",
        data: data,
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

const createPemasukan = async (req, res) => {
  const { tgl, nama, qty, pemasukan } = req.body;

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

  if (pemasukan === undefined || pemasukan === "")
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
      "INSERT INTO pemasukan(tgl, nama, qty, pemasukan) VALUES(?,?,?,?)",
      [tgl, nama, qty, pemasukan]
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
  findPemasukanById,
  createPemasukan,
  deletePemasukan,
};
