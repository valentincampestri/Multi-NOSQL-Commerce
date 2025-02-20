
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    telefono: String,
    direccion: {
        type: {
            calle: String,
            ciudad: String,
            pais: String
        }, required: true
    },
    fecha_registro: { type: Date, default: Date.now },
    categoria: { type: String, enum: ["TOP", "MEDIUM", "LOW"], default: "LOW" },
    historial_pedidos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    es_admin: { type: Boolean, default: false }
}, { timestamps: true });


module.exports = mongoose.model("User", UserSchema);