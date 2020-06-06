let Producto = require("../modelos/producto.model");

const getProducts = (req,res)=>{
    let desde = req.query.desde ||0;
    desde = Number(desde);
    let limite = req.query.limite ||5;
    limite = Number(limite);
    Producto.find({disponible:true})
        .skip(desde)//para saltar de 5 en 5 en la paginacion
        .limit(limite)//para traer por consulta solo 5 documentos
        .sort('descripcion')
        .populate('usuario ', 'nombre, email ')
        .populate('categoria', 'descripcion')
        .exec((err,producto)=>{//para ejecutar
            if( err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            //la condicion que va en el countDocuments debe ser la misma que esta en la find de arriba
            Producto.countDocuments({disponible:true},(err,conteo)=>{
                res.json({
                    ok: true,
                    producto,
                    cuantos: conteo
                })
            })
        });
}

const getProductById = (req,res)=>{

    let id = req.params.id;
    Producto.findById(id)
    .populate('usuario ', 'nombre, email ')
    .populate('categoria', 'descripcion')
    .exec((err,producto) =>{
            if( err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if(!producto){
                return res.status(400).json({
                    ok: false,
                    err:{
                        message: "Producto no existe"
                    }
                })
            }
            if(producto.disponible===false){
                return res.status(400).json({
                    ok: false,
                    err:{
                        message: "Producto no existe"
                    }
                })
            }
            return res.json({
                ok: true,
                producto
            })
        });
}

const createProduct = (req,res)=>{

    let body = req.body;
    let _id = req.usuario._id

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: _id
    })
    producto.save((err,productoDB)=>{
        if( err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        res.json({
            ok: true,
            producto: productoDB
        })
    })
}

const updateProduct = (req,res)=>{
    let id = req.params.id;
    let body = req.body;
    let upProduct = {
        nombre: body.nombre,
        descripcion: body.descripcion,
        precioUni: body.precioUni,
        categoria: body.categoria
    }
    //findByIdAndUpdate(id,{json},option,callback)
    //option=esto es para que nos muestre el nuevo dpmumento y para que nos corra las
    //validaciones del esquema del modelo
    Producto.findByIdAndUpdate(id,upProduct,{new: true,runValidators:true},(err,productoDB)=>{
        if( err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        res.json({
            ok: true,
            categoria: productoDB,
            message: "Producto modificado"
        })
    })
}

const deleteProduct = (req,res)=>{
    let id = req.params.id;
    let deleteLogic = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id,deleteLogic,{new: true,runValidators:true},(err,productoDB)=>{
        if( err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!productoDB ){
            return res.status(400).json({
                ok: false,
                err: {
                    message:"Producto no encontrado"
                }
            });
        }
        if(productoDB.disponible===false ){
            return res.status(400).json({
                ok: false,
                err: {
                    message:"Producto no encontrado"
                }
            });
        }
        res.json({
            ok: true,
            usuario: productoDB,
            message: "Producto eliminado"
        })
    })
}
const searchProduct = (req,res)=>{

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i')
    Producto.find({nombre: regex,disponible: true})
        .populate('categoria', 'descripcion')
        .exec((err,productos)=>{
            if( err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok:true,
                productos
            })
        })
}
module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProduct
}