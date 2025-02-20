const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const  {verificarToken}  = require("../auth/middleware");

router.post("/carrito/agregar",verificarToken, cartController.addToCart);
router.get("/carrito",verificarToken, cartController.getCart);
router.delete("/carrito/eliminar",verificarToken, cartController.removeFromCart);
router.delete("/carrito/vaciar",verificarToken, cartController.clearCart);
router.post("/carrito/checkout",verificarToken, cartController.checkout);

module.exports = router;
