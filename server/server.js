require("./config/config")
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

//configuraciones bodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// rutas
app.use(require("./routes/usuario.route"))
mongoose.connect(process.env.URLDB,
{
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex : true
}
,(err)=>{
    if(err)throw err;
    console.log("base de datos online");
})
app.listen(process.env.PORT,console.log(`app corriendo en el puerto ${process.env.PORT}`))