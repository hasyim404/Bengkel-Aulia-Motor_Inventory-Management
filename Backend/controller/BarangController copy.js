const query = require("../database");
const path = require("path");
const fs = require("fs");

const getBarang = async (req, res) => {
  try {
    console.log("ss");
    const data = await query(
      `SELECT barang.id AS id_barang, n_barang, jml_stok, tipe_stok, h_beli, h_jual, merk.id AS id_merk, n_merk, img, kategori.id AS id_kategori, n_kategori, ukuran.id AS id_ukuran, n_ukuran, f_name, l_name, barang.updated_at AS waktu
       FROM barang 
       INNER JOIN kategori ON kategori.id = barang.kategori_id
       INNER JOIN merk ON merk.id = barang.merk_id
       INNER JOIN ukuran ON ukuran.id = barang.ukuran_id
       INNER JOIN users ON users.id = barang.users_id
       ORDER BY waktu DESC`
    );

    const { q } = req.query;
    const keys = ["n_barang", "n_merk"];
    const search = (data) => {
      return data.filter((item) =>
        keys.some((key) => item[key].toLowerCase().includes(q))
      );
    };
    // console.log(q);

    const terendah = await query(
      `
      SELECT id, n_barang, jml_stok, tipe_stok, img FROM barang WHERE jml_stok <= 7 ORDER BY jml_stok DESC
      `
    );

    console.log(terendah);

    return res.status(200).json({
      success: true,
      message: "Menampilkan seluruh Data Barang",
      data: data,
      terendah: terendah,
      qq: search(data),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Data Barang tidak ditemukan / Gagal",
    });
  }
};

const findBarangById = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await query(`SELECT * FROM barang WHERE id = ?`, [id]);

    if (data.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Data Barang berhasil ditemukan",
        data: data,
      });
    } else
      res.status(400).json({
        success: false,
        message: "Data Barang tidak ditemukan! / Gagal",
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const createBarang = async (req, res) => {
  if (req.files === null) {
    try {
      const {
        n_barang,
        jml_stok,
        tipe_stok,
        h_beli,
        h_jual,
        merk_id,
        img,
        kategori_id,
        ukuran_id,
        users_id,
      } = req.body;

      if (
        n_barang === undefined ||
        n_barang === "" ||
        jml_stok === undefined ||
        jml_stok === "" ||
        tipe_stok === undefined ||
        tipe_stok === "" ||
        h_beli === undefined ||
        h_beli === "" ||
        h_jual === undefined ||
        h_jual === "" ||
        merk_id === undefined ||
        merk_id === "" ||
        kategori_id === undefined ||
        kategori_id === "" ||
        ukuran_id === undefined ||
        ukuran_id === "" ||
        users_id === undefined ||
        users_id === ""
      )
        return res.status(400).json({
          success: false,
          message: "Data Wajib di isi!",
          data: { ...req.body },
        });

      const isDuplicate = await query(
        `SELECT id FROM barang WHERE n_barang = ?`,
        [n_barang]
      );

      if (isDuplicate.length > 0)
        return res.status(409).json({
          success: false,
          message: "Barang sudah ada / Terduplikasi",
        });

      const { resultId: id } = await query(
        "insert into barang(n_barang, jml_stok, tipe_stok, h_beli, h_jual, merk_id, img, kategori_id, ukuran_id, users_id) values(?,?,?,?,?,?,?,?,?,?)",
        [
          n_barang,
          jml_stok,
          tipe_stok,
          h_beli,
          h_jual,
          merk_id,
          img,
          kategori_id,
          ukuran_id,
          users_id,
        ]
      );

      const date = new Date();
      const formattedDate = date.toISOString().split("T")[0];
      const barangId = result.insertId;
      const pengeluaran = jml_stok * h_beli;
      // Tambahkan pengeluaran ke laporan keuangan
      await query(
        `INSERT INTO pengeluaran (tgl, barang_id, qty, pemasukan) VALUES (?,?,?,?)`,
        [formattedDate, barangId, jml_stok, pengeluaran]
      );

      return res.status(200).json({
        success: true,
        message: "Barang berhasil ditambahkan!",
        data: { id, ...req.body },
      });
    } catch (error) {
      console.error(error.message);
      return res.status(400).json({
        success: false,
        message: "Data Barang Gagal ditambahkan",
      });
    }
  } else {
    const file = req.files.img;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = Date.now() + "_" + file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    // const url = `/images/${fileName}`;
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

    file.mv(`./public/images/${fileName}`, async (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      try {
        const {
          n_barang,
          jml_stok,
          tipe_stok,
          h_beli,
          h_jual,
          merk_id,
          img = url,
          kategori_id,
          ukuran_id,
          users_id,
        } = req.body;

        if (
          n_barang === undefined ||
          n_barang === "" ||
          jml_stok === undefined ||
          jml_stok === "" ||
          tipe_stok === undefined ||
          tipe_stok === "" ||
          h_beli === undefined ||
          h_beli === "" ||
          h_jual === undefined ||
          h_jual === "" ||
          merk_id === undefined ||
          merk_id === "" ||
          kategori_id === undefined ||
          kategori_id === "" ||
          ukuran_id === undefined ||
          ukuran_id === "" ||
          users_id === undefined ||
          users_id === ""
        )
          return res.status(400).json({
            success: false,
            message: "Data Wajib di isi!",
            data: { ...req.body },
          });

        const isDuplicate = await query(
          `SELECT id FROM barang WHERE n_barang = ?`,
          [n_barang]
        );

        if (isDuplicate.length > 0)
          return res.status(409).json({
            success: false,
            message: "Barang sudah ada / Terduplikasi",
          });

        const { resultId: id } = await query(
          "insert into barang(n_barang, jml_stok, tipe_stok, h_beli, h_jual, merk_id, img, kategori_id, ukuran_id, users_id) values(?,?,?,?,?,?,?,?,?,?)",
          [
            n_barang,
            jml_stok,
            tipe_stok,
            h_beli,
            h_jual,
            merk_id,
            img,
            kategori_id,
            ukuran_id,
            users_id,
          ]
        );

        // const pengeluaran = jml_stok * h_jual
        // // Tambahkan pengeluaran ke laporan keuangan
        // await query(
        //   `INSERT INTO pengeluaran (tgl, barang_id, qty, pemasukan) VALUES (?,?,?,?)`,
        //   []
        // );

        return res.status(200).json({
          success: true,
          message: "Barang berhasil ditambahkan!",
          data: { id, ...req.body },
        });
      } catch (error) {
        console.error(error.message);
        return res.status(400).json({
          success: false,
          message: "Data Barang Gagal ditambahkan",
        });
      }
    });
  }
};

const updateBarang = async (req, res) => {
  try {
    const { id } = req.params;

    let fileName = "";
    const getImg = await query("SELECT img FROM barang WHERE id = ?", [id]);
    const imgDB = getImg[0].img;
    if (req.files === null) {
      fileName = imgDB;
      console.log("woi");
    } else {
      const file = req.files.img;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      fileName = Date.now() + "_" + file.md5 + ext;
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

      fileName = imgDB.split("images/")[1] || imgDB;
      const filePath = `./public/images/${fileName}`;

      // console.log(imgDB);
      // console.log(req.files);

      if (imgDB === "") {
        const file = req.files.img;
        const ext = path.extname(file.name);
        fileName = Date.now() + "_" + file.md5 + ext;
        file.mv(`./public/images/${fileName}`, (err) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message,
            });
          }
        });
      } else {
        fileName = imgDB.split("images/")[1] || imgDB;
        fs.unlinkSync(filePath);
        file.mv(`./public/images/${fileName}`, (err) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message,
            });
          }
        });
      }
    }

    if (fileName.includes("images")) {
      fileName = imgDB.split("images/")[1] || imgDB;
      const filePath = `./public/images/${fileName}`;
      fs.unlinkSync(filePath);
    }

    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

    const {
      n_barang,
      jml_stok,
      tipe_stok,
      h_beli,
      h_jual,
      merk_id,
      img = url,
      kategori_id,
      ukuran_id,
      users_id,
    } = req.body;

    console.log(img);

    if (
      n_barang === undefined ||
      n_barang === "" ||
      jml_stok === undefined ||
      jml_stok === "" ||
      tipe_stok === undefined ||
      tipe_stok === "" ||
      h_beli === undefined ||
      h_beli === "" ||
      h_jual === undefined ||
      h_jual === "" ||
      merk_id === undefined ||
      merk_id === "" ||
      kategori_id === undefined ||
      kategori_id === "" ||
      users_id === undefined ||
      users_id === ""
    )
      return res.status(400).json({
        success: false,
        message: "Data Wajib di isi!",
        data: { ...req.body },
      });

    const data = await query(
      "UPDATE barang SET n_barang = ?, jml_stok = ?, tipe_stok = ?, h_beli = ?, h_jual = ?, merk_id = ?, img = ?, kategori_id = ?, ukuran_id = ?, users_id = ? WHERE id = ?",
      [
        n_barang,
        jml_stok,
        tipe_stok,
        h_beli,
        h_jual,
        merk_id,
        img,
        kategori_id,
        ukuran_id,
        users_id,
        id,
      ]
    );

    if (data.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        message: "Data Barang berhasil diupdate!",
        data: { id, ...req.body },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Data Barang tidak ditemukan / Gagal",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteBarang = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(404).json({
      success: false,
      message: "Gagal menghapus, data Barang tidak ditemukan!",
    });
  }

  try {
    const getImg = await query("SELECT img FROM barang WHERE id = ?", [id]);
    const img = getImg[0].img;
    const fileName = img.split("images/")[1] || img;
    const filePath = `./public/images/${fileName}`;

    await query("DELETE FROM barang WHERE id = ?", [id]);
    fs.unlinkSync(filePath);

    return res.status(200).json({
      success: true,
      message: "Data Barang berhasil dihapus!",
    });
  } catch (error) {
    // console.error(error);
    return res.status(404).json({
      success: false,
      message: "Gagal menghapus, data Barang tidak ditemukan!",
    });
  }
};

module.exports = {
  getBarang,
  findBarangById,
  createBarang,
  updateBarang,
  deleteBarang,
};