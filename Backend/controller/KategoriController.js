const query = require("../database");

const getKategori = async (req, res) => {
  try {
    const data = await query(
      "SELECT id, n_kategori, catatan, updated_at FROM kategori ORDER BY updated_at DESC"
    );

    const { q } = req.query;
    const keys = ["n_kategori"];
    const search = (data) => {
      return data.filter((item) =>
        keys.some((key) => item[key].toLowerCase().includes(q))
      );
    };
    // console.log(q);

    return res.status(200).json({
      success: true,
      message: "Menampilkan seluruh Data Kategori",
      data: data,
      qq: search(data),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Data Kategori tidak ditemukan / Gagal",
    });
  }
};

const findKategoriById = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await query(`SELECT * FROM kategori WHERE id = ?`, [id]);

    if (data.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Data Kategori berhasil ditemukan",
        data: data,
      });
    } else
      res.status(400).json({
        success: false,
        message: "Data Kategori tidak ditemukan! / Gagal",
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const createKategori = async (req, res) => {
  const { n_kategori, catatan } = req.body;

  if (n_kategori === undefined || n_kategori === "")
    return res.status(400).json({
      success: false,
      message: "Kategori wajib di isi!",
    });

  try {
    const isDuplicate = await query(
      `SELECT id FROM kategori WHERE n_kategori = ?`,
      [n_kategori]
    );

    if (isDuplicate.length > 0)
      return res.status(400).json({
        success: false,
        message: "Kategori sudah ada / Terduplikasi",
      });

    const { resultId: id } = await query(
      "INSERT INTO kategori(n_kategori, catatan) VALUES(?,?)",
      [n_kategori, catatan]
    );

    return res.status(200).json({
      success: true,
      message: "Kategori berhasil ditambahkan!",
      data: { id, ...req.body },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Data Kategori Gagal ditambahkan",
    });
  }
};

const updateKategori = async (req, res) => {
  const { id } = req.params;
  const { n_kategori, catatan } = req.body;

  if (n_kategori === undefined || n_kategori === "")
    return res.status(400).json({
      success: false,
      message: "Nama Kategori wajib di isi!",
    });

  try {
    const isDuplicate = await query(
      `SELECT id FROM kategori WHERE n_kategori = ?`,
      [n_kategori]
    );

    if (isDuplicate.length > 1)
      return res.status(400).json({
        success: false,
        message: "Kategori sudah ada / Terduplikasi",
      });

    const data = await query(
      "UPDATE kategori SET n_kategori = ?, catatan = ? WHERE id = ?",
      [n_kategori, catatan, id]
    );

    if (data.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        message: "Data Kategori berhasil diupdate!",
        data: { id, ...req.body },
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Data Kategori tidak ditemukan / Gagal",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const deleteKategori = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await query("DELETE FROM kategori WHERE id = ?", [id]);

    if (!data) {
      const error = new Error("Data ini sedang digunakan, tidak bisa di hapus");
      error.status = 400;
      throw error;
    } else if (data.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        message: "Data Kategori berhasil dihapus!",
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
  getKategori,
  findKategoriById,
  createKategori,
  updateKategori,
  deleteKategori,
};
