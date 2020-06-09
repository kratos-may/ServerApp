const Usuario = require("../modelos/usuario.model");
const Producto = require("../modelos/producto.model");
const fs = require("fs");
const path = require("path");
const uploadFile = (req,res)=>{
    let tipo = req.params.tipo;
    let id = req.params.id;
    if(!req.files){
        return res.status(400).json({
            ok:false,
            err: {
                message: "No se ha seleccionado ningun archivo"
            }
        });
    }
    let archivo = req.files.archivo;
    //validar tipo
    let tiposValidos = ["productos","usuarios"];
    if(tiposValidos.indexOf(tipo)<0){
        return res.status(400).json({
            ok:false,
            err: {
                message:"Los tipos validos son:" + tiposValidos.join(",")
            }
        })
    }
    //validar extensiones de los archivos subidos
    let nombreArchivo = archivo.name.split('.');
    let extensionValida = nombreArchivo[nombreArchivo.length -1 ]
    let extensiones = ['png','jpg','gif','jpeg'];

    if(extensiones.indexOf(extensionValida)<0){
        return res.status(400).json({
            ok:false,
            err: {
                message:" las extensiones permitidas son:" + extensiones.join(","),
                ext: extensionValida
            }
        })
    }
    // cambiar nombre al archivo
    let nuevoNombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionValida}`
    archivo.mv(`uploads/${tipo}/${nuevoNombreArchivo}`,(err)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(tipo==="usuarios"){
            imagenUsuario(id,res,nuevoNombreArchivo);
        }else{
            imagenProducto(id,res,nuevoNombreArchivo)
        }
    })

}

function imagenUsuario(id, res, nombre){
    Usuario.findById(id, (err,usuarioDB)=>{
        if(err){
            borrarArchivo(nombre,"usuarios");
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(!usuarioDB){
            borrarArchivo(nombre,"usuarios");
            return res.status(400).json({
                ok:false,
                err: {
                    message: " Usuario no existe"
                }
            });
        }
        borrarArchivo(usuarioDB.img,"usuarios")
        usuarioDB.img = nombre;
        usuarioDB.save((err,usuarioGuardado)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            }
            res.json({
                ok:true,
                usuario: usuarioGuardado,
                img: nombre
            })
        })

    });
}
function imagenProducto(id, res, nombre){
    Producto.findById(id, (err,productoDB)=>{
        if(err){
            borrarArchivo(nombre,"productos");
            return res.status(500).json({
                ok:false,
                error: {
                    message:"aqui1",
                    err
                }
            });
        }
        if(!productoDB){
            borrarArchivo(nombre,"productos");
            return res.status(400).json({
                ok:false,
                err: {
                    message: " Producto no existe"
                }
            });
        }
        borrarArchivo(productoDB.img,"productos")
        productoDB.img = nombre;
        productoDB.save((err,productoGuardado)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    error: {
                        message:"aqui2",
                        err
                    }
                });
            }
            res.json({
                ok:true,
                producto: productoGuardado,
                img: nombre
            })
        })

    });
}
function borrarArchivo(nombreImagen, tipo){
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
}
module.exports={
    uploadFile
}