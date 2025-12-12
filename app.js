import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

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

// Inicializar
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Leer pedidos en tiempo real
const pedidosRef = ref(db, "pedidos");
const lista = document.getElementById("listaPedidos");

onValue(pedidosRef, snapshot => {
    lista.innerHTML = ""; // limpia antes de volver a mostrar

    if (!snapshot.exists()) {
        lista.innerHTML = "<p>No hay pedidos aún...</p>";
        return;
    }

    snapshot.forEach(child => {
        const pedido = child.val();

        const div = document.createElement("div");
        div.classList.add("pedido");

        div.innerHTML = `
            <h3>Pedido #${pedido.id}</h3>
            <p><strong>Producto:</strong> ${pedido.producto}</p>
            <p><strong>Precio:</strong> $${pedido.precio}</p>
            <p><strong>Hora:</strong> ${pedido.hora}</p>
        `;

        lista.appendChild(div);
    });
});
