const query = require("../database");
const bcryptjs = require("bcryptjs");

const getUsers = async (req, res) => {
  try {
    const data = await query(
      "SELECT id, f_name, l_name, email, gender, role, phone_number, updated_at FROM users ORDER BY updated_at DESC"
    );

    const { q } = req.query;
    const keys = ["f_name", "l_name", "email", "role"];
    const search = (data) => {
      return data.filter((item) =>
        keys.some((key) => item[key].toLowerCase().includes(q))
      );
    };

    return res.status(200).json({
      success: true,
      message: "Menampilkan seluruh Data Users",
      data: data,
      qq: search(data),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Data Users tidak ditemukan / Gagal",
    });
  }
};

const findUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await query(`SELECT * FROM users WHERE id = ?`, [id]);

    if (data.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Data User berhasil ditemukan",
        data: data,
      });
    } else
      res.status(400).json({
        success: false,
        message: "Data User tidak ditemukan! / Gagal",
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;

  const user = await query(`SELECT * FROM users WHERE id = ?`, [id]);
  if (!user) return res.status(404).json({ message: "No data found" });

  try {
    const {
      f_name,
      l_name,
      email,
      password,
      confPassword,
      gender,
      role,
      phone_number,
    } = req.body;

    if (
      f_name === undefined ||
      f_name === "" ||
      l_name === undefined ||
      l_name === "" ||
      email === undefined ||
      email === "" ||
      (password && password === "") ||
      (confPassword && confPassword === "") ||
      gender === undefined ||
      gender === "" ||
      role === undefined ||
      role === "" ||
      phone_number === undefined ||
      isNaN(+phone_number)
    ) {
      return res.status(400).json({
        success: false,
        message: "Data Wajib di isi!",
        data: { ...req.body },
      });
    }

    if (password && password !== confPassword) {
      return res.status(400).json({
        success: false,
        message: "Password tidak sama",
        data: { ...req.body },
      });
    }

    let updateUserQuery = `
      UPDATE users 
      SET f_name = ?, l_name = ?, email = ?, gender = ?, role = ?, phone_number = ? 
    `;
    let queryParams = [f_name, l_name, email, gender, role, phone_number];

    // Jika password disediakan, tambahkan password ke query
    if (password) {
      const salt = await bcryptjs.genSalt(12);
      const hashedPassword = await bcryptjs.hash(password, salt);
      updateUserQuery += `, password = ?`;
      queryParams.push(hashedPassword);
    }

    const { id } = req.params;
    updateUserQuery += ` WHERE id = ?`;
    queryParams.push(id);

    const { affectedRows } = await query(updateUserQuery, queryParams);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan atau tidak ada perubahan data",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User berhasil diupdate!",
      data: { id, ...req.body },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUsers = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await query("DELETE FROM users WHERE id = ?", [id]);

    if (data.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        message: "Data Users berhasil dihapus!",
      });
    } else
      res.status(400).json({
        success: false,
        message: "Data Users tidak ditemukan! / Gagal",
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = {
  getUsers,
  findUserById,
  updateUser,
  deleteUsers,
};
