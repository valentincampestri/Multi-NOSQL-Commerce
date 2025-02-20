const Order = require("../models/Order");
const User = require("../models/User");
const Cart = require("../models/Cart");

exports.getOrdersByUser = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const orders = await Order.find({ usuario_id });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener pedidos", error });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los pedidos", error });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Pedido no encontrado" });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el pedido", error });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrder) return res.status(404).json({ message: "Pedido no encontrado" });
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar pedido", error });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) return res.status(404).json({ message: "Pedido no encontrado" });
        res.status(200).json({ message: "Pedido eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar pedido", error });
    }
};