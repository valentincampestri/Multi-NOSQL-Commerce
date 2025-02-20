const Redis = require("ioredis");

// Crear cliente Redis con configuración
const client = new Redis(process.env.REDIS_URL, {
    username: process.env.REDIS_USERNAME || "default",
    password: process.env.REDIS_PASSWORD,
    tls: process.env.REDIS_URL.includes("rediss://") ? {} : undefined, // Soporte para conexiones seguras
});

// Manejo de errores
client.on("error", (err) => {
    console.error("❌ Error en Redis:", err);
});

client.on("connect", () => {
    console.log("✅ Conectado a Redis con ioredis");
});

module.exports = client;