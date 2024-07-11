const query = require("../../database");
const { randomUUID } = require("crypto");
const bcryptjs = require("bcryptjs");
const {
  jwt,
  jwtSecret,
  jwtAlgorithm,
  jwtExpiresIn,
} = require("./JwtConfig.js");

const { compare } = bcryptjs;

const signToken = (userId) => {
  return jwt.sign({ id: userId }, jwtSecret, {
    algorithm: jwtAlgorithm,
    expiresIn: jwtExpiresIn,
  });
};

const formatPhoneNumber = (phoneNumber) => {
  // Hilangkan semua spasi, tanda kurung, dan strip
  phoneNumber = phoneNumber.replace(/[\s\(\)\-]/g, "");

  // Jika angka depan 0, ganti dengan 62
  if (/^0/.test(phoneNumber)) {
    phoneNumber = phoneNumber.replace(/^0/, "62");
  }

  // Jika angka depan +, hilangkan
  else if (/^\+/.test(phoneNumber)) {
    phoneNumber = phoneNumber.replace(/^\+/, "");
  }

  // Validasi nomor telepon
  const validFormat = /^62\d{9,13}$/.test(phoneNumber);
  if (!validFormat) {
    return "Format nomor telepon tidak valid";
  }

  return phoneNumber;
};

const register = async (req, res) => {
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
    password === undefined ||
    password === "" ||
    confPassword === undefined ||
    confPassword === "" ||
    gender === undefined ||
    gender === "" ||
    role === undefined ||
    role === "" ||
    phone_number === undefined ||
    phone_number === "" ||
    isNaN(phone_number)
  )
    return res.status(400).json("Data tidak Valid!");

  if (password !== confPassword)
    return res.status(400).json("Password tidak sama!");

  if (formatPhoneNumber(phone_number) === "Format nomor telepon tidak valid") {
    return res.status(400).json("Format nomor telepon salah!");
  }

  try {
    const salt = await bcryptjs.genSalt(12);
    const hash = await bcryptjs.hash(password, salt);

    const { resultId } = await query(
      `
          INSERT INTO users(uuid, f_name, l_name, email, password, gender, role, phone_number) VALUES(?,?,?,?,?,?,?,?)
        `,
      [
        randomUUID(),
        f_name,
        l_name,
        email,
        hash,
        gender,
        role,
        formatPhoneNumber(phone_number),
      ]
    );

    const token = signToken(resultId); // Gunakan resultId langsung

    return res.status(200).json({
      success: true,
      message: "Registrasi Berhasil! User berhasil ditambahkan",
      token,
      data: { id: resultId, ...req.body },
    });
  } catch (error) {
    console.error("Database Error:", error);

    return res.status(500).json({
      success: false,
      message: "Registrasi Gagal",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (
    email === undefined ||
    email === "" ||
    password === undefined ||
    password === ""
  ) {
    return res.status(400).json({
      status: "Gagal",
      message: "Error Validasi",
      error: "Data tidak valid!",
    });
  }

  try {
    const user = await query("SELECT * FROM users WHERE email = ?", [email]);

    if (user.length === 0) {
      return res.status(401).json({
        status: "Gagal",
        message: "Error Login",
        error: "Email atau password salah!",
      });
    }

    const isPasswordMatch = await compare(password, user[0].password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        status: "Gagal",
        message: "Error Login",
        error: "Email atau password salah!",
      });
    }

    const token = signToken(user[0].id);

    return res.status(200).json({
      status: "Berhasil",
      message: "Login Berhasil",
      token,
      data: {
        id: user[0].id,
        email: user[0].email,
        f_name: user[0].f_name,
        l_name: user[0].l_name,
        role: user[0].role,
        gender: user[0].gender,
        phone_number: user[0].phone_number,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "Gagal",
      message: "Gagal Login",
      error: "Login gagal!",
    });
  }
};

module.exports = {
  register,
  login,
};
