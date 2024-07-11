const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;
const jwtAlgorithm = process.env.JWT_ALGHORITM;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

module.exports = {
  jwt,
  jwtSecret,
  jwtAlgorithm,
  jwtExpiresIn,
};
