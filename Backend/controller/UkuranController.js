const query = require("../database");

const getUkuran = async (req, res) => {
  try {
    const data = await query(
      "SELECT id, n_ukuran, catatan, updated_at FROM ukuran ORDER BY updated_at DESC"
    );

    return res.status(200).json({
      success: true,
      message: "Menampilkan seluruh Data Ukuran",
      data: data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Data Ukuran tidak ditemukan / Gagal",
    });
  }
};

const findUkuranById = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await query(`SELECT * FROM ukuran WHERE id = ?`, [id]);

    if (data.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Data Ukuran berhasil ditemukan",
        data: data,
      });
    } else
      res.status(400).json({
        success: false,
        message: "Data Ukuran tidak ditemukan! / Gagal",
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const createUkuran = async (req, res) => {
  const { n_ukuran, catatan } = req.body;

  if (n_ukuran === undefined || n_ukuran === "")
    return res.status(400).json({
      success: false,
      message: "Nama Ukuran wajib di isi!",
    });

  try {
    const isDuplicate = await query(
      `SELECT id FROM ukuran WHERE n_ukuran = ?`,
      [n_ukuran]
    );

    if (isDuplicate.length > 0)
      return res.status(400).json({
        success: false,
        message: "Ukuran sudah ada / Terduplikasi",
      });

    const { resultId: id } = await query(
      "INSERT INTO ukuran(n_ukuran, catatan) VALUES(?,?)",
      [n_ukuran, catatan]
    );

    return res.status(200).json({
      success: true,
      message: "Data Ukuran berhasil ditambahkan!",
      data: { id, ...req.body },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Data Ukuran Gagal ditambahkan",
    });
  }
};

const updateUkuran = async (req, res) => {
  const { id } = req.params;
  const { n_ukuran, catatan } = req.body;

  if (n_ukuran === undefined || n_ukuran === "") {
    return res.status(400).json({
      success: false,
      message: "Nama Ukuran wajib di isi!",
    });
  }

  try {
    const isDuplicate = await query(
      `SELECT id FROM ukuran WHERE n_ukuran = ?`,
      [n_ukuran]
    );

    if (isDuplicate.length > 1)
      return res.status(400).json({
        success: false,
        message: "Ukuran sudah ada / Terduplikasi",
      });

    const data = await query(
      "UPDATE ukuran SET n_ukuran = ?, catatan = ? WHERE id = ?",
      [n_ukuran, catatan, id]
    );

    if (data.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        message: "Data Ukuran berhasil diupdate!",
        data: { id, ...req.body },
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Data Ukuran tidak ditemukan / Gagal",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const deleteUkuran = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await query("DELETE FROM ukuran WHERE id = ?", [id]);

    if (!data) {
      const error = new Error("Data ini sedang digunakan, tidak bisa di hapus");
      error.status = 400;
      throw error;
    } else if (data.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        message: "Data Ukuran berhasil dihapus!",
      });
    }
  } catch (error) {
    return res.status(error.status || 404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getUkuran,
  findUkuranById,
  createUkuran,
  updateUkuran,
  deleteUkuran,
};
