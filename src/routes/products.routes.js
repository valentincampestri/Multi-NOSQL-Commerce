const express = require("express");
const { createProduct, getAllProducts } = require("../controllers/products.controller");

const router = express.Router();
const productController = require("../controllers/products.controller");
const { verificarToken } = require("../auth/middleware");

router.post("/productos", verificarToken, productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.put("/:id",verificarToken, productController.updateProduct);
router.delete("/:id",verificarToken, productController.deleteProduct);

module.exports = router;