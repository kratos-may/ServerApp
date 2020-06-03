const express = require("express");
const app = express();
const userController = require("../controller/usuario.controller");

app.get("/usuario", userController.getAllUser)
app.post("/usuario", userController.createUser);
app.put("/usuario/:id",userController.updateUser);
app.delete("/usuario/:id", userController.deleteUser);
module.exports=app;