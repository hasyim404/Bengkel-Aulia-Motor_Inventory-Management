const express = require("express");
const routes = express();
const {
  getUsers,
  findUserById,
  updateUser,
  deleteUsers,
} = require("../controller/UserController");

routes.get("/users", getUsers);
routes.get("/users/:id", findUserById);
routes.put("/users/:id", updateUser);
routes.delete("/users/:id", deleteUsers);

module.exports = routes;
