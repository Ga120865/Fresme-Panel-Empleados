// panel.js
import { db } from "./firebase.js";
import { ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

const ordersEl = document.getElementById("orders");

function createCard(key, o) {
  const card = document.createElement("article");
  card.className = "card";

  card.innerHTML = `
    <div class="row">
      <div class="title">Pedido #${key.slice(-6)}</div>
      <div class="small">${o.time}</div>
    </div>

    <div class="small"><strong>${o.nombre} ${o.apellido}</strong></div>

    <div class="small"><strong>Tamaño:</strong> ${o.size}</div>

    <div class="list"><strong>Salsas:</strong><br>${o.salsas.join("<br>")}</div>

    <div class="list"><strong>Toppings:</strong><br>${o.toppings.join("<br>")}</div>

    <div class="row"><strong>Total:</strong> $${o.total.toFixed(2)}</div>

    <div class="small"><strong>Estado:</strong> ${o.status}</div>
  `;

  const actions = document.createElement("div");
  actions.className = "actions";

  actions.innerHTML = `
    <button class="btn pending">Preparando</button>
    <button class="btn prep">Listo</button>
    <button class="btn ready">Entregado</button>
  `;

  actions.children[0].onclick = () => update(ref(db, "orders/" + key), { status: "Preparando" });
  actions.children[1].onclick = () => update(ref(db, "orders/" + key), { status: "Listo" });
  actions.children[2].onclick = () => update(ref(db, "orders/" + key), { status: "Entregado" });

  card.appendChild(actions);
  return card;
}

onValue(ref(db, "orders/"), (snapshot) => {
  ordersEl.innerHTML = "";
  const data = snapshot.val();
  if (!data) return;

  Object.entries(data)
    .reverse()
    .forEach(([key, o]) => ordersEl.appendChild(createCard(key, o)));
});
