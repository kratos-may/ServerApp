const express = require("express");
let {verifyToken} = require("../middleware/auth");
let productoController = require("../controller/producto.controller");

let app = express();
//trae todos los productos y populate ususario categoria, y paginado
app.get("/productos",verifyToken,productoController.getProducts);
app.get("/productos/buscar/:termino", verifyToken,productoController.searchProduct);
app.post("/productos",verifyToken,productoController.createProduct);
app.get("/productos/:id",verifyToken,productoController.getProductById);
app.put("/productos/:id",verifyToken,productoController.updateProduct);
// eliminacion cambiando disponible
app.delete("/productos/:id",verifyToken,productoController.deleteProduct);


module.exports = app;

