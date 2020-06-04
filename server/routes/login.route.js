const express = require("express");
const app = express();
const userController = require("../controller/usuario.controller");
const {verifyTokenGoogle} = require("../middleware/auth")

app.post("/login",userController.login);
app.post("/google",verifyTokenGoogle,userController.loginGoogle);

module.exports= app;