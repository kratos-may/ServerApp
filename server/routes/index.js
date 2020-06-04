const express = require("express");
const app = express();
const usuarioRoute = require("./usuario.route");
const loginRoute = require("./login.route");

app.use(usuarioRoute);
app.use(loginRoute);

module.exports = app;