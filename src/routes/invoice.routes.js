const express = require("express");

const router = express.Router()
const invoiceController = require("../controllers/invoice.controller");

const { verificarToken } = require("../auth/middleware");

router.post("/facturas",verificarToken, invoiceController.createInvoice);
router.get("/:usuario_id",verificarToken, invoiceController.getInvoicesByUser);
router.get("/",verificarToken, invoiceController.getAllInvoices);
router.get("/:id",verificarToken, invoiceController.getInvoiceById);
router.put("/:id",verificarToken, invoiceController.updateInvoice);
router.delete("/:id",verificarToken, invoiceController.deleteInvoice);
router.post("/payment",verificarToken, invoiceController.payInvoice);

module.exports = router;
