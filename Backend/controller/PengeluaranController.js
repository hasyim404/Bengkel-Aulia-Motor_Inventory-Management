const pdf = require("pdf-creator-node");
const fs = require("fs");
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

    queryStr += " ORDER BY updated_at DESC";

    const data = await query(queryStr, queryParams);

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

const findPengeluaranById = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await query(`SELECT * FROM pengeluaran WHERE id = ?`, [id]);

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
      message: "Kolom pengeluaran wajib di isi!",
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

const exportPDF = async (req, res) => {
  try {
    const newDate = new Date();
    const date = newDate.toISOString().split("T")[0];

    let pathFile = "./public/pdfs";
    let fileName = `${date}_data-pengeluaran.pdf`;
    let fullPath = pathFile + "/" + fileName;
    let html;

    if (process.env.HOSTING === "true") {
      html = fs.readFileSync("./template/hosting/pengeluaran.html", "utf-8");
    } else {
      html = fs.readFileSync("./template/pengeluaran.html", "utf-8");
    }

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

    const { start, end } = req.query;
    let queryStr = "SELECT * FROM pengeluaran";
    let queryParams = [];
    if (start && end) {
      queryStr += " WHERE tgl BETWEEN ? AND ?";
      queryParams.push(start, end);
    }
    queryStr += " ORDER BY updated_at DESC";
    const data = await query(queryStr, queryParams);

    const toIDR = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    const toDate = new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const convToDate = (date) => {
      return new Date(date);
    };

    let toStart = "";
    let toEnd = "";

    if (start && end) {
      toStart = toDate.format(convToDate(start));
      toEnd = toDate.format(convToDate(end));
    }

    let datas = [];
    data.forEach((data, no) => {
      datas.push({
        no: no + 1,
        tgl: toDate.format(data.tgl),
        nama: data.nama,
        qty: data.qty,
        pengeluaran: toIDR.format(data.pengeluaran),
      });
    });
    let document = {
      html: html,
      data: {
        logo: logo,
        start: toStart,
        end: toEnd,
        pengeluaran: datas,
      },
      path: fullPath,
      type: "",
    };

    const create = await pdf.create(document, option);

    if (create) {
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

    const fileName = `${date}_data-pengeluaran.pdf`;

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
  getPengeluaran,
  findPengeluaranById,
  createPengeluaran,
  deletePengeluaran,
  exportPDF,
  namePDF,
};
