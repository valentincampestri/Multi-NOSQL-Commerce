document.addEventListener("DOMContentLoaded", function () {
    // Verifica si el usuario es Admin y muestra un mensaje en index.html
    let isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin === "true") {
        let adminPanel = document.createElement("div");
        adminPanel.style.background = "#222";
        adminPanel.style.color = "white";
        adminPanel.style.padding = "10px";
        adminPanel.style.textAlign = "center";
        adminPanel.innerHTML = `<p>🔑 Bienvenido, Administrador.</p>`;
        document.body.prepend(adminPanel);
    }

    // Cargar productos desde la API
    fetch("http://localhost:3000/api/productos")
        .then(response => response.json())
        .then(products => {
            let productList = document.getElementById("product-list");
            if (productList) {
                products.forEach(product => {
                    let div = document.createElement("div");
                    div.classList.add("product-card");
                    div.innerHTML = `
                        <h3>${product.nombre}</h3>
                        <p>${product.descripcion}</p>
                        <p><strong>Precio:</strong> $${product.precio_actual}</p>
                        <button onclick="addToCart('${product._id}', '${product.nombre}', ${product.precio_actual})">
                            Agregar al carrito
                        </button>
                    `;
                    productList.appendChild(div);
                });
            }
        })
        .catch(error => console.error("Error al cargar productos:", error));

    // Cargar productos en el carrito si estamos en cart.html
    let cartList = document.getElementById("cart-list");
    let totalPrice = document.getElementById("total-price");

    if (cartList && totalPrice) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        
        if (cart.length === 0) {
            cartList.innerHTML = "<p>Tu carrito está vacío.</p>";
        } else {
            let total = 0;
            cart.forEach(item => {
                let li = document.createElement("li");
                li.innerHTML = `${item.name} - $${item.price}`;
                cartList.appendChild(li);
                total += item.price;
            });

            totalPrice.innerHTML = `<strong>Total: $${total}</strong>`;
        }
    }

    // Cargar historial de pedidos si estamos en orders.html
    let ordersList = document.getElementById("orders-list");
    if (ordersList) {
        let orders = JSON.parse(localStorage.getItem("orders")) || [];
        
        if (orders.length === 0) {
            ordersList.innerHTML = "<p>No tienes pedidos aún.</p>";
        } else {
            orders.forEach(order => {
                let li = document.createElement("li");
                li.innerHTML = `<strong>Pedido #${order.id}</strong> - Total: $${order.total}`;
                ordersList.appendChild(li);
            });
        }
    }
});

// Función para agregar productos al carrito
function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ id, name, price });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Producto agregado al carrito");
}

// Función para finalizar compra
function checkout() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    let total = cart.reduce((sum, item) => sum + item.price, 0);
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    let newOrder = {
        id: orders.length + 1,
        total: total,
        items: cart
    };

    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.removeItem("cart");

    alert("Compra finalizada. Tu pedido ha sido registrado.");
    window.location.href = "orders.html";
}

// Manejo del Login con usuario Admin hardcodeado
document.getElementById("login-form")?.addEventListener("submit", function (e) {
    e.preventDefault();

    // Credenciales hardcodeadas para el administrador
    const adminEmail = "admin@ecommerce.com";
    const adminPassword = "Admin123";

    // Obtener datos ingresados por el usuario
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    // Verificar si coincide con el usuario admin
    if (email === adminEmail && password === adminPassword) {
        alert("Inicio de sesión exitoso como Administrador");
        localStorage.setItem("isAdmin", "true");  // Guardamos el estado de admin
        window.location.href = "index.html";      // Redirige al inicio
        return;
    }

    // Si no es admin, intentar autenticación con el backend
    fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("isAdmin", "false"); // Usuario normal
            alert("Inicio de sesión exitoso");
            window.location.href = "index.html";
        } else {
            alert("Error en el inicio de sesión");
        }
    })
    .catch(error => console.error("Error en el login:", error));
});
