const express = require("express");
const routes = express();
const { register, login } = require("../../controller/auth/AuthController");

routes.post("/register", register);
routes.post("/login", login);

module.exports = routes;
