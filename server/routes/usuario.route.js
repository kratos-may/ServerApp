const express = require("express");
const app = express();
const userController = require("../controller/usuario.controller");
const {verifyToken,verifyAdminRole} = require("../middleware/auth");

app.get("/usuario", verifyToken,userController.getAllUser)
app.post("/usuario",[verifyToken,verifyAdminRole],userController.createUser);
app.put("/usuario/:id",[verifyToken,verifyAdminRole],userController.updateUser);
app.delete("/usuario/:id",[verifyToken,verifyAdminRole],userController.deleteUser);
module.exports=app;