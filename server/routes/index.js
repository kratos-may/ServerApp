const express = require("express");
const app = express();
const usuarioRoute = require("./usuario.route");
const loginRoute = require("./login.route");
const categoriasRoute = require("./categorias.route");
const productosRoute = require("./productos.route");
const uploadRoute = require("./upload.route");
const imgRoute = require("./imagenes.route");

app.use(usuarioRoute);
app.use(loginRoute);
app.use(categoriasRoute);
app.use(productosRoute);
app.use(uploadRoute);
app.use(imgRoute);


module.exports = app;