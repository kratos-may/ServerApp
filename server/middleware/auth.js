const jwt = require("jsonwebtoken");
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
//=======================
//Verifica token
//=======================
let verifyToken = ( req,res,next)=>{
    let token = req.get('token');
    jwt.verify(token,process.env.SEED, (err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: " token invalido"
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
}
//=======================
//Verifica token google
//=======================
let verifyTokenGoogle = async ( req,res,next)=>{
    let token = req.body.idtoken;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    }).catch(e=>{
        return res.status(403).json({
            ok:false,
            err:e
        })
    })
    const payload = ticket.getPayload();
    req.usuario = {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
    next();
}
//=======================
//Verifica Role
//=======================
let verifyAdminRole = ( req,res,next)=>{
    let usuario = req.usuario;
    if(usuario.role === "ADMIN_ROLE"){
        next();
    }else{
        return res.json({
            ok: false,
            err:{
                message: "El usuario no es administrador"
            }
        })
    }

}
module.exports ={
    verifyToken,
    verifyAdminRole,
    verifyTokenGoogle
}