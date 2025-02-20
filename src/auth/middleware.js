const jwt = require("jsonwebtoken");
const User = require("../models/User");
const redis = require("../config/redis"); // Usa la misma instancia

const saveUserSession = async (token) => {

    const sessionKey = `session:${token}`; // Usamos el token como clave de la sesión

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Información que se guardará en la sesión
    const sessionData = {
        user_id: decoded.id,
        login_time: new Date(),
    };

    // Guardar en Redis con un tiempo de expiración (por ejemplo, 1 hora)
    await redis.set(sessionKey, JSON.stringify(sessionData), "EX", 3600); // Expira en 1 hora
};

const getSession = async (token) => {
    const sessionKey = `session:${token}`;
    const sessionData = await redis.get(sessionKey);
    return sessionData ? JSON.parse(sessionData) : null;
};

const verificarToken = async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
    }

    try {

        const session = await getSession(token);

        if(!session){
            return res.status(401).json({ message: "Token inválido o expirado." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        await saveUserSession(token);
        
        req.usuario = decoded; // Agregamos la info del usuario al request
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado." });
    }
};

const esAdmin = async (usuario_id) => {
    const user = await User.findById(usuario_id);
    return user.es_admin;
}

module.exports = {saveUserSession, esAdmin, verificarToken}
