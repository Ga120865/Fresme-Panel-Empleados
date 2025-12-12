import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCGAfu9XB2EcVhV4kEv_xNOKI5YoLjZhr4",
    authDomain: "fresme-app.firebaseapp.com",
    databaseURL: "https://fresme-app-default-rtdb.firebaseio.com",
    projectId: "fresme-app",
    storageBucket: "fresme-app.firebasestorage.app",
    messagingSenderId: "68669835916",
    appId: "1:68669835916:web:ed424d557a616fb37149a9",
    measurementId: "G-RPSCTLQ9RG"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const ordersContainer = document.getElementById("ordersContainer");

// Escuchar pedidos en tiempo real
const ordersRef = ref(db, "orders");

onValue(ordersRef, (snapshot) => {
    ordersContainer.innerHTML = "";

    if (!snapshot.exists()) {
        ordersContainer.innerHTML = "<p class='loading'>No hay pedidos aún</p>";
        return;
    }

    const orders = snapshot.val();

    Object.keys(orders).forEach(orderId => {
        const order = orders[orderId];

        const card = document.createElement("div");
        card.className = "order-card";

        card.innerHTML = `
            <h3>Pedido #${orderId}</h3>
            <p><strong>Nombre:</strong> ${order.name || "Sin nombre"}</p>
            <p><strong>Base:</strong> ${order.base}</p>
            <p><strong>Toppings:</strong> ${order.toppings.join(", ")}</p>
            <p><strong>Fecha:</strong> ${order.time}</p>
        `;

        ordersContainer.appendChild(card);
    });
});
