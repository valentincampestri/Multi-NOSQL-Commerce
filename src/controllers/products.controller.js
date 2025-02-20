const { esAdmin } = require("../auth/middleware");
const Product = require("../models/Product");
const { productosHardcodeados } = require("../models/Product");

exports.createProduct = async (req, res) => {
    if (await esAdmin(req.usuario.id) == false) {
        res.status(403).json({ message: "Accion no autorizada" });
    }
    try {
        const { nombre, descripcion, categorias, precio_actual, stock, imagen } = req.body;

        const newProduct = new Product({
            nombre,
            descripcion,
            categorias,
            precio_actual,
            historial_precios: [{ precio: precio_actual }],
            stock,
            imagen
        });

        await newProduct.save();
        res.status(201).json({ message: "Producto creado exitosamente", producto: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el producto", error });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos", error });
    }
};

// Obtener producto por ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Producto no encontrado" });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener producto", error });
    }
};

// Modificar producto
exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: "Producto no encontrado" });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar producto", error });
    }
};

// Eliminar producto
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: "Producto no encontrado" });
        res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar producto", error });
    }
};
