const express = require("express");
const app = express();
const usuarioRoute = require("./usuario.route");
const loginRoute = require("./login.route");
const categoriasRoute = require("./categorias.route");
const productosRoute = require("./productos.route");

app.use(usuarioRoute);
app.use(loginRoute);
app.use(categoriasRoute);
app.use(productosRoute);


module.exports = app;