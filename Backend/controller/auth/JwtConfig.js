const jwt = require("jsonwebtoken");

const jwtSecret = "lalapanEnaknyaPakeSambel_21";
const jwtAlgorithm = "HS256";
const jwtExpiresIn = "1h";

module.exports = {
  jwt,
  jwtSecret,
  jwtAlgorithm,
  jwtExpiresIn,
};
