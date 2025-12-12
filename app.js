import { db } from "./firebase.js";
import { ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

const ordersEl = document.getElementById("orders");

function createCard(key, o){
  const card = document.createElement("article");
  card.className = "card";

  const header = document.createElement("div");
  header.className = "row";
  header.innerHTML = `<div class="title">Pedido #${key.slice(-6)}</div><div class="small">${o.time}</div>`;

  const cliente = document.createElement("div");
  cliente.className = "small";
  cliente.innerHTML = `<strong>${o.nombre} ${o.apellido}</strong> — ${o.tipo || ""}`;

  const size = document.createElement("div");
  size.className = "small";
  size.innerHTML = `<strong>Tamaño:</strong> ${o.size} — $${(o.basePrice||0).toFixed(2)}`;

  const salsas = document.createElement("div");
  salsas.className = "list";
  salsas.innerHTML = `<strong>Salsas:</strong><br>${(o.salsas||[]).join("<br>")}`;

  const toppings = document.createElement("div");
  toppings.className = "list";
  toppings.innerHTML = `<strong>Toppings:</strong><br>${(o.toppings||[]).join("<br>")}`;

  const total = document.createElement("div");
  total.className = "row";
  total.innerHTML = `<div class="small"><strong>Total</strong></div><div><strong>$${(parseFloat(o.total)||0).toFixed(2)}</strong></div>`;

  const status = document.createElement("div");
  status.className = "small";
  status.innerHTML = `<strong>Estado:</strong> ${o.status}`;

  const actions = document.createElement("div");
  actions.className = "actions";

  const btnPend = document.createElement("button");
  btnPend.className = "btn pending";
  btnPend.innerText = "Preparando";
  btnPend.onclick = ()=> update(ref(db, "orders/" + key), { status: "Preparando" });

  const btnListo = document.createElement("button");
  btnListo.className = "btn prep";
  btnListo.innerText = "Listo";
  btnListo.onclick = ()=> update(ref(db, "orders/" + key), { status: "Listo" });

  const btnEntreg = document.createElement("button");
  btnEntreg.className = "btn ready";
  btnEntreg.innerText = "Entregado";
  btnEntreg.onclick = ()=> update(ref(db, "orders/" + key), { status: "Entregado" });

  actions.appendChild(btnPend);
  actions.appendChild(btnListo);
  actions.appendChild(btnEntreg);

  card.appendChild(header);
  card.appendChild(cliente);
  card.appendChild(size);
  card.appendChild(salsas);
  card.appendChild(toppings);
  card.appendChild(total);
  card.appendChild(status);
  card.appendChild(actions);

  if(o.status === "Pendiente"){
    card.style.borderLeft = "6px solid #ffcf33";
  } else if(o.status === "Preparando"){
    card.style.borderLeft = "6px solid #7bc8ff";
  } else if(o.status === "Listo"){
    card.style.borderLeft = "6px solid #7ee88b";
  } else if(o.status === "Entregado"){
    card.style.opacity = "0.6";
    card.style.borderLeft = "6px solid #d9d9d9";
  }

  return card;
}

onValue(ref(db, "orders/"), snapshot => {
  ordersEl.innerHTML = "";
  const data = snapshot.val();
  if(!data) return;

  const entries = Object.entries(data);
  entries.reverse().forEach(([key, o]) => {
    ordersEl.appendChild(createCard(key, o));
  });
});
