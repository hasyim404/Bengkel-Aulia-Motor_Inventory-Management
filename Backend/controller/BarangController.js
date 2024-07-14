const query = require("../database");
const path = require("path");
const pdf = require("pdf-creator-node");
const fs = require("fs");

const getBarang = async (req, res) => {
  try {
    const data = await query(
      `SELECT barang.id AS id_barang, n_barang, jml_stok, tipe_stok, h_beli, h_jual, merk.id AS id_merk, n_merk, img, kategori.id AS id_kategori, n_kategori, ukuran.id AS id_ukuran, n_ukuran, f_name, l_name, barang.updated_at AS waktu
       FROM barang 
       INNER JOIN kategori ON kategori.id = barang.kategori_id
       INNER JOIN merk ON merk.id = barang.merk_id
       INNER JOIN ukuran ON ukuran.id = barang.ukuran_id
       INNER JOIN users ON users.id = barang.users_id
       ORDER BY waktu DESC`
    );

    const terendah = await query(
      `
      SELECT id, n_barang, jml_stok, tipe_stok, img FROM barang WHERE jml_stok <= 7 ORDER BY jml_stok DESC
      `
    );

    const { q } = req.query;
    const keys = ["n_barang", "n_merk"];
    const search = (data) => {
      return data.filter((item) =>
        keys.some((key) => item[key].toLowerCase().includes(q))
      );
    };
    // console.log(q);

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

      const result = await query(
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
        `INSERT INTO pengeluaran (tgl, nama, qty, pengeluaran) VALUES (?,?,?,?)`,
        [formattedDate, n_barang, jml_stok, pengeluaran]
      );

      return res.status(200).json({
        success: true,
        message: "Barang berhasil ditambahkan!",
        data: { id: barangId, ...req.body },
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

    file.mv(`./public/images/${fileName}`, async (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      try {
        const result = await query(
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
          `INSERT INTO pengeluaran (tgl, nama, qty, pengeluaran) VALUES (?,?,?,?)`,
          [formattedDate, n_barang, jml_stok, pengeluaran]
        );

        return res.status(200).json({
          success: true,
          message: "Barang berhasil ditambahkan!",
          data: { id: barangId, ...req.body },
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

const getPreviousStock = async (barangId) => {
  const [previousStockResult] = await query(
    "SELECT jml_stok FROM barang WHERE id = ?",
    [barangId]
  );
  return previousStockResult ? previousStockResult.jml_stok : 0;
};

const updateBarang = async (req, res) => {
  const { id } = req.params;

  const barang = await query(`SELECT * FROM barang WHERE id = ?`, [id]);
  if (!barang.length) return res.status(404).json({ message: "No data found" });

  let fileName = "";
  if (req.files === null) {
    fileName = barang[0].img;
  } else {
    const file = req.files.img;
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

    const theImg = barang[0].img;
    const split = theImg.split("images/")[1];
    const filePath = `./public/images/${split}`;
    if (split !== undefined) {
      fs.unlinkSync(filePath);
    }

    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
    });
  }

  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

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
      users_id === undefined ||
      users_id === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Data Wajib di isi!",
        data: { ...req.body },
      });
    }

    const previousStock = await getPreviousStock(id);

    await query(
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

    const date = new Date();
    const formattedDate = date.toISOString().split("T")[0];

    let qtyDifference = jml_stok - previousStock;
    let financialImpact = Math.abs(qtyDifference) * h_beli;

    if (qtyDifference > 0) {
      // Stock increased, this is an expense
      await query(
        "INSERT INTO pengeluaran (tgl, nama, qty, pengeluaran) VALUES (?,?,?,?)",
        [formattedDate, n_barang, qtyDifference, financialImpact]
      );
    } else if (qtyDifference < 0) {
      // Stock decreased, this is an income
      await query(
        "INSERT INTO pemasukan (tgl, nama, qty, pemasukan) VALUES (?,?,?,?)",
        [formattedDate, n_barang, Math.abs(qtyDifference), financialImpact]
      );
    }

    return res.status(200).json({
      success: true,
      message: "Data Barang berhasil diupdate!",
      data: { id, ...req.body },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteBarang = async (req, res) => {
  const { id } = req.params;
  const getBarang = await query("SELECT id FROM barang WHERE id = ?", [id]);

  if (getBarang.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Data Barang tidak ditemukan!",
    });
  }

  try {
    const getImg = await query("SELECT img FROM barang WHERE id = ?", [id]);
    const img = getImg[0].img;

    if (img !== null && img.includes("images")) {
      const fileName = img.split("images/")[1];
      const filePath = `./public/images/${fileName}`;
      fs.unlinkSync(filePath);
    }
    await query("DELETE FROM barang WHERE id = ?", [id]);

    return res.status(200).json({
      success: true,
      message: "Data Barang berhasil dihapus!",
    });
  } catch (error) {
    console.error(error);
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const exportPDF = async (req, res) => {
  try {
    const newDate = new Date();
    const date = newDate.toISOString().split("T")[0];

    let pathFile = "./public/pdfs";
    let fileName = `${date}_data-barang.pdf`;
    let fullPath = pathFile + "/" + fileName;
    let html = fs.readFileSync("./template/barang.html", "utf-8");

    const bitmap = fs.readFileSync("./public/images/main-logo.png");
    const logo = bitmap.toString("base64");

    let option = {
      format: "A4",
      orientation: "landscape",
      border: "10mm",
      header: {
        height: "1mm",
        // contents: kop,
      },
      footer: {
        // height: "10mm",
        contents: {
          // first: "Cover page",
          // 2: "Second page", // Any page number is working. 1-based index
          default: `
            <div style="padding-top: 3rem;">
            <hr>
              <span style="color: #444; font-weight: bold;">
                Halaman {{page}} / {{pages}}
              </span>
            </div>
            `, // fallback value
          // default:
          //   '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
          // last: "Last Page",
        },
      },
    };

    const data = await query(
      `SELECT barang.id AS id_barang, n_barang, jml_stok, tipe_stok, h_beli, h_jual, merk.id AS id_merk, n_merk, img, kategori.id AS id_kategori, n_kategori, ukuran.id AS id_ukuran, n_ukuran, f_name, l_name, barang.updated_at AS waktu
       FROM barang 
       INNER JOIN kategori ON kategori.id = barang.kategori_id
       INNER JOIN merk ON merk.id = barang.merk_id
       INNER JOIN ukuran ON ukuran.id = barang.ukuran_id
       INNER JOIN users ON users.id = barang.users_id
       ORDER BY waktu DESC`
    );

    const toIDR = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    let datas = [];
    data.forEach((data, no) => {
      let noImg = "";
      if (data.img === "") {
        noImg = "";
      } else {
        noImg = data.img;
      }

      datas.push({
        no: no + 1,
        n_barang: data.n_barang,
        jml_stok: data.jml_stok,
        tipe_stok: data.tipe_stok,
        h_beli: toIDR.format(data.h_beli),
        h_jual: toIDR.format(data.h_jual),
        merk: data.n_merk,
        kategori: data.n_kategori,
        ukuran: data.n_ukuran,
        users: data.f_name + data.l_name,
        img: noImg,
      });
    });
    let document = {
      html: html,
      data: {
        logo: logo,
        barang: datas,
      },
      path: fullPath,
      type: "",
    };

    const process = await pdf.create(document, option);

    if (process) {
      res.download(fullPath, fileName, (err) => {
        if (err) {
          console.error(err);
          res
            .status(500)
            .json({ success: false, message: "Gagal mengunduh file PDF" });
        } else {
          fs.unlinkSync(fullPath);
        }
      });
    }
    return fileName;
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

const namePDF = async (req, res) => {
  try {
    const newDate = new Date();
    const date = newDate.toISOString().split("T")[0];

    const fileName = `${date}_data-barang.pdf`;

    res.status(200).json({
      success: true,
      data: fileName,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Error: ${error.message}`,
    });
  }
};

module.exports = {
  getBarang,
  findBarangById,
  createBarang,
  updateBarang,
  deleteBarang,
  exportPDF,
  namePDF,
};
