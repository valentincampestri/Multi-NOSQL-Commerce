const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
    pedido_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fecha: { type: Date, default: Date.now },
    total: { type: Number, required: true },
    metodo_pago: String,
    estado: { type: String, enum: ["Pendiente", "Pagado", "Rechazado"], default: "Pendiente" }
}, { timestamps: true });

module.exports = mongoose.model("Invoice", InvoiceSchema);
