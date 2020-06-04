const express = require("express");
const app = express();
const userController = require("../controller/usuario.controller");

app.post("/login",userController.login);

module.exports= app;