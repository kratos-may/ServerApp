const express = require("express");
let imgController = require("../controller/imagenes.controller");
let {verifyTokenImg} = require("../middleware/auth");
let app = express();

app.get("/imagen/:tipo/:img", verifyTokenImg,imgController.getImg);

module.exports = app;