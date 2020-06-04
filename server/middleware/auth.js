const jwt = require("jsonwebtoken");
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
    verifyAdminRole
}