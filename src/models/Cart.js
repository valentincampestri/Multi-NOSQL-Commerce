const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productos: [{
        producto_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        nombre: String,
        cantidad: Number,
        precio_unitario: Number
    }],
    total: { type: Number, default: 0 },
    fecha_actualizacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Cart", cartSchema);