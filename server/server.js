require("./config/config")
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

//configuraciones bodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// rutas
app.get("/usuario", (req,res)=>{
    res.json("Hola mundo");
})
app.post("/usuario", (req,res)=>{
    let body = req.body;
    if (body.nombre === undefined)
    {
        res.status(400).json({
            ok: false,
            mensaje: "falta el nombre"
        })
    }else{
        res.json({body});
    }
})
app.put("/usuario:id", (req,res)=>{
    let id = req.params.id;
    res.json({
        id
    });
})
app.delete("/usuario", (req,res)=>{
    res.json("Hola mundo");
})

app.listen(process.env.PORT,console.log(`app corriendo en el puerto ${process.env.PORT}`))