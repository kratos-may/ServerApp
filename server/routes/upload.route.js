const express = require("express");
const fileUpload = require("express-fileupload");
let uploadController = require("../controller/upload.controller");
let {verifyToken} = require("../middleware/auth");

const app = express();

//config
app.use(fileUpload());

app.put("/upload/:tipo/:id", verifyToken,uploadController.uploadFile);

module.exports = app;



