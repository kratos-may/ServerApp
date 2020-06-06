const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, "La descripcion de la categoria es obligatoria"]
    },
    usuario: {
        type: Schema.Types.ObjectId, ref: 'Usuario'
    }
});
module.exports = mongoose.model('Categoria',categoriaSchema);