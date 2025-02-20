const Redis = require("ioredis");
const redis = require("../config/redis"); // Usa la misma instancia

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

const saveCartToRedis = async (cart) => {
    const key = `cart:${cart.usuario_id}`; // Clave única por usuario
    await redis.set(key, JSON.stringify(cart), "EX", 3600); // Expira en 1 hora
};

const getCartFromRedis = async (usuario_id) => {
    const key = `cart:${usuario_id}`;
    const cartData = await redis.get(key);
    return cartData ? JSON.parse(cartData) : null;
};

const removeCartFromRedis = async (usuario_id) => {
    const key = `cart:${usuario_id}`;
    const result = await redis.del(key);
    return result > 0; // Retorna true si se eliminó correctamente
};

const clearCartFromDB = async (req, res, usuario_id) => {
    
    try {
        const cart = await Cart.findOneAndDelete({ usuario_id });

        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        await removeCartFromRedis(usuario_id);

        res.status(200).json({ message: "Carrito vaciado correctamente" });

    } catch (error) {
        res.status(500).json({ message: "Error al vaciar el carrito", error });
    }
}


// Agregar un producto al carrito
exports.addToCart = async (req, res) => {
    try {
        const {producto_id, cantidad } = req.body;
        const usuario_id = req.usuario.id

        let cart = await Cart.findOne({ usuario_id });

        // Buscar el producto en la base de datos
        const product = await Product.findById(producto_id);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        if (!cart) {
            cart = new Cart({ usuario_id, productos: [], total: 0 });
        }

        // Verificar si el producto ya está en el carrito
        const existingProduct = cart.productos.find(p => p.producto_id.equals(producto_id));

        if (existingProduct) {
            existingProduct.cantidad = (existingProduct.cantidad + cantidad) >= 1 ?
                (existingProduct.cantidad) + cantidad : 1; // Controlo que sea como minimo 0
        } else {
            cart.productos.push({
                producto_id,
                nombre: product.nombre,
                cantidad,
                precio_unitario: product.precio_actual
            });
        }

        // Recalcular el total del carrito
        cart.total = cart.productos.reduce((sum, item) => sum + item.cantidad * item.precio_unitario, 0);
        cart.fecha_actualizacion = Date.now();

        await cart.save();

        await saveCartToRedis(cart);

        res.status(200).json({ message: "Producto agregado al carrito", carrito: cart });

    } catch (error) {
        res.status(500).json({ message: "Error al agregar producto al carrito", error });
    }
};

// Obtener el carrito de un usuario
exports.getCart = async (req, res) => {
    const usuario_id  = req.usuario.id;

    let cart = await getCartFromRedis(usuario_id);

    if (!cart) {
        console.log("Cache miss! Buscando en MongoDB...");
        cart = await Cart.findOne({ usuario_id }).populate("productos.producto_id");

        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        await saveCartToRedis(cart);
    } else {
        console.log("Cache hit! Carrito obtenido desde Redis.");
    }

    res.json(cart);
};

// Eliminar un producto del carrito
exports.removeFromCart = async (req, res) => {
    try {
        const {producto_id } = req.body;
        const usuario_id = req.usuario.id
        let cart = await Cart.findOne({ usuario_id });

        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        cart.productos = cart.productos.filter(p => !p.producto_id.equals(producto_id));

        // Recalcular el total
        cart.total = cart.productos.reduce((sum, item) => sum + item.cantidad * item.precio_unitario, 0);
        cart.fecha_actualizacion = Date.now();

        if(cart.productos.length > 0){
            await cart.save();
            await saveCartToRedis(cart);
        }else{
            await clearCartFromDB(req, res, usuario_id)
        }


    } catch (error) {
        res.status(500).json({ message: "Error al eliminar producto del carrito", error });
    }
};

// Vaciar el carrito
exports.clearCart = async (req, res) => {
    try {
        const usuario_id = req.usuario.id
        await clearCartFromDB(req, res, usuario_id)
    } catch (error) {
        res.status(500).json({ message: "Error al vaciar el carrito", error });
    }
};

exports.checkout = async (req, res) => {
    try {
        const usuario_id = req.usuario.id;

        const cart = await Cart.findOne({ usuario_id });

        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        const user = await User.findById(usuario_id);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // 2️⃣ Convertir los productos del carrito al formato de la orden
        const productosOrden = cart.productos.map((producto) => ({
            producto_id: producto.producto_id.toString(), // Convertir ObjectId a string
            nombre: producto.nombre,
            cantidad: producto.cantidad,
            precio_unitario: producto.precio_unitario
        }));

        const total = cart.productos.reduce((sum, item) => sum + item.cantidad * item.precio_unitario, 0);

        const direccionFinal = {
            calle: user.direccion.calle,
            ciudad: user.direccion.ciudad,
            pais: user.direccion.pais
        }

        const newOrder = new Order({
            usuario_id,
            productos: productosOrden,
            total,
            direccion_envio : direccionFinal
        });

        await newOrder.save();

        await Cart.findOneAndDelete({ usuario_id });

        await removeCartFromRedis(usuario_id);

        // Agregar el pedido al historial del usuario
        await User.findByIdAndUpdate(usuario_id, { $push: { historial_pedidos: newOrder._id } });

        res.status(201).json({ message: "Pedido creado exitosamente", pedido: newOrder });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el pedido", error });
    }
};
