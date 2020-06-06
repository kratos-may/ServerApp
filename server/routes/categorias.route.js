const express = require("express");
let {verifyToken,verifyAdminRole} = require("../middleware/auth");
let categoriaController = require("../controller/categoria.controller");

let app = express();
//mostrar todas las categorias
app.get("/categoria",  verifyToken,categoriaController.getCategories);
//crear nueva categoria
app.post("/categoria", verifyToken, categoriaController.createCategory);
//mostrar una categoria por id
app.get("/categoria/:id", verifyToken,categoriaController.getCategoryById);
//modificar categoria
app.put("/categoria/:id", [verifyToken,verifyAdminRole], categoriaController.updateCategory);
//borrar categoria, solo admin puede borrarc, borrar fisicamente
app.delete("/categoria/:id", [verifyToken,verifyAdminRole],categoriaController.deleteCategory);

module.exports= app;