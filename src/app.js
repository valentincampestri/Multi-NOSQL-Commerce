require('dotenv').config();

console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("REDIS_URL:", process.env.REDIS_URL);
console.log("PORT:", process.env.PORT);

// Rest of the app.js code...

const express = require('express');
const cors = require('cors');
const connectMongo = require('./config/mongo');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Rutas
const userRoutes = require("./routes/users.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/orders.routes");
const invoiceRoutes = require("./routes/invoice.routes");  // Nueva ruta para facturas
const productRoutes = require("./routes/products.routes");  // Nueva ruta para productos

app.use("/app/users", userRoutes);
app.use("/app/orders", orderRoutes);
app.use("/app/invoices", invoiceRoutes);
app.use("/app/products", productRoutes);
app.use("/app/cart", cartRoutes);

// Conectar a la base de datos
connectMongo(); // Conectar a MongoDB

// Iniciar servidor
const PORT = process.env.PORT || 3000; // Usa el puerto del .env o 3000 por defecto
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

module.exports = app;