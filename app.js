import { db } from "./firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const listaPedidos = document.getElementById("listaPedidos");

onValue(ref(db, "pedidos/"), snapshot => {
    listaPedidos.innerHTML = "";

    snapshot.forEach(child => {
        const pedido = child.val();

        const div = document.createElement("div");
        div.classList.add("pedido");

        div.innerHTML = `
            <h3>Tamaño: ${pedido.tamaño}</h3>
            <p><strong>Toppings:</strong> ${pedido.toppings.join(", ")}</p>
            <p><strong>Salsa:</strong> ${pedido.salsa}</p>
            <p><strong>Hora:</strong> ${pedido.hora}</p>
        `;

        listaPedidos.appendChild(div);
    });
});
