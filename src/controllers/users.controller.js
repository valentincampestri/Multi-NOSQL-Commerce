const User = require("../models/User");
const Order = require("../models/Order");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {saveUserSession} = require("../auth/middleware.js")

const register = async (req, res) => {
    try {
        const { nombre, email, password, direccion } = req.body;

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ nombre, email, password: hashedPassword, direccion });
        await newUser.save();

        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar usuario", error });
    }
};

const actualizarCategoriaUsuario = async (usuario_id) => {
    try {
        const haceUnMes = new Date();
        haceUnMes.setMonth(haceUnMes.getMonth() - 1); // Fecha de hace un mes

        // Buscar pedidos en el último mes con estado "Pagado"
        const pedidos = await Order.find({
            usuario_id,
            estado: "Pagado",
            createdAt: { $gte: haceUnMes },
        });

        // Calcular el total gastado
        const totalGastado = pedidos.reduce((sum, pedido) => sum + pedido.total, 0);

        // Determinar nueva categoría
        let nuevaCategoria = "LOW";
        if (totalGastado > 50000) {
            nuevaCategoria = "TOP";
        } else if (totalGastado > 10000) {
            nuevaCategoria = "MEDIUM";
        }

        // Actualizar solo si la categoría cambia
        const usuario = await User.findById(usuario_id);
        if (usuario.categoria !== nuevaCategoria) {
            usuario.categoria = nuevaCategoria;
            await usuario.save();
            console.log(`✅ Usuario ${usuario.nombre} actualizado a categoría ${nuevaCategoria}`);
        } else {
            console.log(`ℹ️ Usuario ${usuario.nombre} mantiene su categoría ${usuario.categoria}`);
        }
    } catch (error) {
        console.error("❌ Error al actualizar la categoría del usuario:", error);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        await saveUserSession(token);

        res.json({ message: "Inicio de sesión exitoso", token });
    } catch (error) {
        res.status(500).json({ message: "Error en el inicio de sesión" + error.message, error });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los usuarios", error });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el usuario", error });
    }
};

const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ message: "Usuario no encontrado" });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar usuario", error });
    }
};

const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: "Usuario no encontrado" });
        res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar usuario", error });
    }
};

module.exports = {register, login, getAllUsers, getUserById, updateUser, deleteUser, actualizarCategoriaUsuario}

