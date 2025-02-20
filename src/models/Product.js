const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: String,
    categorias: [String],
    precio_actual: { type: Number, required: true },
    historial_precios: [
        {
            fecha: { type: Date, default: Date.now },
            precio: Number
        }
    ],
    stock: { type: Number, required: true },
    imagen: String
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);


