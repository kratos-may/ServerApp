let Categoria = require("../modelos/categoria.model");

const getCategories = (req,res)=>{
    let desde = req.query.desde ||0;
    desde = Number(desde);
    let limite = req.query.limite ||5;
    limite = Number(limite);
    Categoria.find({})
        .skip(desde)//para saltar de 5 en 5 en la paginacion
        .limit(limite)//para traer por consulta solo 5 documentos
        .sort('descripcion')
        .populate('usuario ', 'nombre, email ')
        .exec((err,categoria)=>{//para ejecutar
            if( err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            //la condicion que va en el countDocuments debe ser la misma que esta en la find de arriba
            Categoria.countDocuments((err,conteo)=>{
                res.json({
                    ok: true,
                    categoria,
                    cuantos: conteo
                })
            })
        });
}

const getCategoryById = (req,res)=>{

    let id = req.params.id;
    Categoria.findById(id, (err,categoria) =>{
            if( err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if(!categoria){
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            return res.json({
                ok: true,
                categoria
            })
        });
}

const createCategory = (req,res)=>{

    let body = req.body;
    let _id = req.usuario._id

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: _id
    })
    categoria.save((err,categoriaDB)=>{
        if( err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
}

const updateCategory = (req,res)=>{
    let id = req.params.id;
    let body = req.body;
    let descCatgeroria = {
        descripcion: body.descripcion
    }
    //findByIdAndUpdate(id,{json},option,callback)
    //option=esto es para que nos muestre el nuevo dpmumento y para que nos corra las
    //validaciones del esquema del modelo
    Categoria.findByIdAndUpdate(id,descCatgeroria,{new: true,runValidators:true},(err,categoriaDB)=>{
        if( err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
}

const deleteCategory = (req,res)=>{
    let id = req.params.id;
    //para borrado fisico
    Categoria.findByIdAndRemove(id,(err,categoriaDelete)=>{
        if( err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!categoriaDelete ){
            return res.status(400).json({
                ok:false,
                err: {
                    message:"Categoria no encontrado"
                }
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDelete,
            message: "Categoria eliminada."
        })
    })
}

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
}