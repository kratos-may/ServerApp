const mongoose = require("mongoose");
let Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
let rolesValidos = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} NO ES UN ROL VALIDO'
};
let usuarioSchema = new Schema({
    nombre:{
        type: String,
        required:[true,"EL NOMBRE ES NECESARIO"]
    },
    email: {
        type: String,
        unique: true,
        required:[true,"EL CORREO ES NECESARIO"]
    },
    password:{
        type: String,
        required: [true, "LA CONTRASEÑA ES OBLIGATORIA"]
    },
    img: {
        type:String,
        required:false
    },
    role:{
        type:String,
        default: "USER_ROLE",
        enum: rolesValidos
    },
    estado:{
        type: Boolean,
        default:true
    },
    google:{
        type: Boolean,
        default:false
    }
});
//para no enviar la contraseña en el json que imprime el server
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}
//para mostrar mensajes de field con la propiedad unique
usuarioSchema.plugin(uniqueValidator, {message:'{PATH} Debe de ser unico'});
module.exports = mongoose.model("Usuario", usuarioSchema);
