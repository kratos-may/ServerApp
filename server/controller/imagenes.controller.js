const fs = require("fs");
const path = require("path");
const getImg = (req,res)=>{

    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if(fs.existsSync(pathImagen)){
        res.sendFile(pathImagen);
    }else{
        let noImagePath = path.resolve(__dirname,'../assets/original.jpg');
        res.sendFile(noImagePath);
    }
}
module.exports = {
    getImg
}