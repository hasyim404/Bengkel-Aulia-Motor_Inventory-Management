const query = require("../database");
const path = require("path");
const fs = require("fs");

const getMerk = async (req, res) => {
  try {
    const data = await query("SELECT * FROM merk ORDER BY updated_at DESC");

    const { q } = req.query;
    const keys = ["n_merk"];
    const search = (data) => {
      return data.filter((item) =>
        keys.some((key) => item[key].toLowerCase().includes(q))
      );
    };

    return res.status(200).json({
      success: true,
      message: "Menampilkan seluruh Data Merk",
      data: data,
      qq: search(data),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Data Merk tidak ditemukan / Gagal",
    });
  }
};

const findMerkById = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await query(`SELECT * FROM merk WHERE id = ?`, [id]);

    if (data.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Data Merk berhasil ditemukan",
        data: data,
      });
    } else
      res.status(400).json({
        success: false,
        message: "Data Merk tidak ditemukan! / Gagal",
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const createMerk = async (req, res) => {
  if (req.files === null) {
    try {
      const { n_merk, logo, catatan } = req.body;

      if (n_merk === undefined || n_merk === "") {
        return res.status(400).json({
          success: false,
          message: "Nama Merk wajib di isi!",
        });
      }

      const isDuplicate = await query(`SELECT id FROM merk WHERE n_merk = ?`, [
        n_merk,
      ]);

      if (isDuplicate.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Merk sudah ada / Terduplikasi",
        });
      }

      const { resultId: id } = await query(
        "INSERT INTO merk(n_merk, logo, catatan) VALUES(?,?,?)",
        [n_merk, logo, catatan]
      );

      return res.status(200).json({
        success: true,
        message: "Data Merk berhasil ditambahkan!",
        data: { id, ...req.body },
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Data Merk Gagal ditambahkan",
      });
    }
  } else {
    const file = req.files.logo;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = Date.now() + "_" + file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/Logo/${fileName}`;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLowerCase())) {
      return res.status(422).json({
        success: false,
        message: "Format invalid, hanya bisa .png, .jpg dan .jpeg !",
      });
    }

    if (fileSize > 5000000) {
      return res.status(422).json({
        success: false,
        message: "Size file terlalu besar, maksimal 5MB !",
      });
    }

    const { n_merk, logo = url, catatan } = req.body;

    if (n_merk === undefined || n_merk === "") {
      return res.status(400).json({
        success: false,
        message: "Nama Merk wajib di isi!",
      });
    }

    const isDuplicate = await query(`SELECT id FROM merk WHERE n_merk = ?`, [
      n_merk,
    ]);

    if (isDuplicate.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Merk sudah ada / Terduplikasi",
      });
    }

    file.mv(`./public/Logo/${fileName}`, async (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }
      try {
        const { resultId: id } = await query(
          "INSERT INTO merk(n_merk, logo, catatan) VALUES(?,?,?)",
          [n_merk, logo, catatan]
        );

        return res.status(200).json({
          success: true,
          message: "Data Merk berhasil ditambahkan!",
          data: { id, ...req.body },
        });
      } catch (error) {
        console.error(error.message);
        return res.status(400).json({
          success: false,
          message: "Data Merk Gagal ditambahkan",
        });
      }
    });
  }
};

const updateMerk = async (req, res) => {
  const { id } = req.params;

  const merk = await query(`SELECT * FROM merk WHERE id = ?`, [id]);
  if (!merk) return res.status(404).json({ message: "No data found" });

  let fileName = "";
  if (req.files === null) {
    fileName = merk[0].logo;
  } else {
    const file = req.files.logo;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = Date.now() + "_" + file.md5 + ext;
    const allowedType = [".png", ".jpeg", ".jpg"];

    if (!allowedType.includes(ext.toLowerCase())) {
      return res.status(422).json({
        success: false,
        message: "Format invalid, hanya bisa .png, .jpg dan .jpeg !",
      });
    }

    if (fileSize > 5000000) {
      return res.status(422).json({
        success: false,
        message: "Size file terlalu besar, maksimal 5MB !",
      });
    }

    const theImg = merk[0].logo;
    const split = theImg.split("Logo/")[1];
    const filePath = `./public/Logo/${split}`;
    const cek = fs.readdirSync("./public/Logo/");
    if (split !== undefined && cek.includes(split)) {
      fs.unlinkSync(filePath);
    }

    file.mv(`./public/Logo/${fileName}`, (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
    });
  }

  const url = `${req.protocol}://${req.get("host")}/Logo/${fileName}`;

  try {
    const { n_merk, logo = url, catatan } = req.body;

    if (n_merk === undefined || n_merk === "") {
      return res.status(400).json({
        success: false,
        message: "Nama Merk wajib di isi!",
      });
    }

    const data = await query(
      "UPDATE merk SET n_merk = ?, logo = ?, catatan = ? WHERE id = ?",
      [n_merk, logo, catatan, id]
    );

    return res.status(200).json({
      success: true,
      message: "Data Merk berhasil diupdate!",
      data: { id, ...req.body },
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteMerk = async (req, res) => {
  const { id } = req.params;
  const getMerk = await query("SELECT id FROM merk WHERE id = ?", [id]);

  if (getMerk.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Data merk tidak ditemukan!",
    });
  }

  try {
    const getLogo = await query("SELECT logo FROM merk WHERE id = ?", [id]);
    const logo = getLogo[0].logo;

    const data = await query("DELETE FROM merk WHERE id = ?", [id]);

    if (!data) {
      // return res.status(404).json({
      //   success: false,
      //   message: "Data ini sedang digunakan, tidak bisa di hapus!",
      // });
      const error = new Error("Data ini sedang digunakan, tidak bisa di hapus");
      error.status = 400;
      throw error;
    } else if (data.affectedRows > 0) {
      if (logo !== null && logo.includes("Logo")) {
        const fileName = logo.split("Logo/")[1];
        const filePath = `./public/Logo/${fileName}`;
        fs.unlinkSync(filePath);
      }
      return res.status(200).json({
        success: true,
        message: "Data Merk berhasil dihapus!",
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
  getMerk,
  findMerkById,
  createMerk,
  updateMerk,
  deleteMerk,
};
