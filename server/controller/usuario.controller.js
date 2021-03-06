const Usuario = require("../modelos/usuario.model");
const _= require("underscore");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const createUser = (req,res) =>{

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password,10),
        role: body.role
    })
    usuario.save((err,usuarioDB)=>{
        if( err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
}

const updateUser = (req,res) =>{
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre','email','img','role','estado'] );
    //findByIdAndUpdate(id,{json},option,callback)
    //option=esto es para que nos muestre el nuevo dpmumento y para que nos corra las
    //validaciones del esquema del modelo
    Usuario.findByIdAndUpdate(id,body,{new: true,runValidators:true},(err,usuarioDB)=>{
        if( err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
}

const getAllUser = (req,res) =>{
    let desde = req.query.desde ||0;
    desde = Number(desde);
    let limite = req.query.limite ||5;
    limite = Number(limite);
    Usuario.find({estado: true},'nombre email role estado google img')
        .skip(desde)//para saltar de 5 en 5 en la paginacion
        .limit(limite)//para traer por consulta solo 5 documentos
        .exec((err,usuarios)=>{//para ejecutar
            if( err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            //la condicion que va en el countDocuments debe ser la misma que esta en la find de arriba
            Usuario.countDocuments({estado: true} ,(err,conteo)=>{
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })
            })
        });
}
const deleteFisicUser = (req,res) =>{
    let id = req.params.id;
    //para borrado fisico
    Usuario.findByIdAndRemove(id,(err,usuarioDelete)=>{
        if( err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if(!usuarioDelete ){
            return res.status(400).json({
                ok:false,
                err: {
                    message:"usuario no encontrado"
                }
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDelete
        })
    })
}
const deleteUser = (req,res) =>{
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id,cambiaEstado,{new: true,runValidators:true},(err,usuarioDB)=>{
        if( err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if(!usuarioDB ){
            return res.status(400).json({
                ok: false,
                err: {
                    message:"Usuario no encontrado"
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
}

const login = (req,res)=>{
    let body = req.body;
    Usuario.findOne({email: body.email}, (err,usuarioDB)=>{
        if( err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message:"Usuario o Contraseña incorrecto"
                }
            });
        }
        if(!bcrypt.compareSync(body.password,usuarioDB.password)){
            return res.status(400).json({
                ok: false,
                err: {
                    message:"Usuario o Contraseña incorrecto"
                }
            });
        }
        let token = jwt.sign({usuario: usuarioDB},process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});
        res.json({
            ok:true,
            usuario:usuarioDB,
            token
        })
    })
}

const loginGoogle = (req,res)=>{
    let googleUser = req.usuario;
    Usuario.findOne({email: googleUser.email}, (err,usuarioDB)=>{
        if( err){
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if(usuarioDB){
            if(usuarioDB.google === false){
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Debe usar la autenticacion comun"
                    }
                });
            }else{
                let token = jwt.sign({usuario: usuarioDB},process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});
                return res.json({
                    ok:true,
                    usuario:usuarioDB,
                    token
                });
            }
        }else{
            //Si el usuario no existe en nuestra base de datos
            let usuario = new Usuario();
            usuario.nombre= googleUser.nombre;
            usuario.email= googleUser.email;
            usuario.img= googleUser.img;
            usuario.google = true;
            usuario.password = ":)";
            usuario.save((err,usuarioDB)=>{
                if( err){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };
                let token = jwt.sign({usuario: usuarioDB},process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});
                return res.json({
                    ok:true,
                    usuario:usuarioDB,
                    token
                });
            })
        }
    });
}
module.exports = {
    createUser,
    updateUser,
    getAllUser,
    deleteUser,
    login,
    loginGoogle
}