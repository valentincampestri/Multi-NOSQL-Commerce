const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productos: [
        {
            producto_id: String,
            nombre: String,
            cantidad: Number,
            precio_unitario: Number
        }
    ],
    total: { type: Number, required: true },
    estado: { type: String, enum: ["Pendiente", "Pagado", "Enviado", "Entregado"], default: "Pendiente" },
    direccion_envio: {
        type: {
            calle: String,
            ciudad: String,
            pais: String
        }, required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);

