// app.js (panel)
import { db } from "./firebase.js";
import { ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

const ordersEl = document.getElementById("orders");

function createCard(key, o){
  const card = document.createElement("article");
  card.className = "card";

  const header = document.createElement("div"); header.className="row";
  header.innerHTML = `<div class="title">Pedido #${key.slice(-6)}</div><div class="small">${o.time}</div>`;

  const cliente = document.createElement("div"); cliente.className="small";
  cliente.innerHTML = `<strong>${o.nombre} ${o.apellido}</strong> — ${o.tipo || ""}`;

  const size = document.createElement("div"); size.className="small";
  size.innerHTML = `<strong>Tamaño:</strong> ${o.size} — $${(o.basePrice||0).toFixed(2)}`;

  const salsas = document.createElement("div"); salsas.className="list";
  salsas.innerHTML = `<strong>Salsas:</strong><br>${(o.salsas||[]).join("<br>")}`;

  const toppings = document.createElement("div"); toppings.className="list";
  toppings.innerHTML = `<strong>Toppings:</strong><br>${(o.toppings||[]).join("<br>")}`;

  const total = document.createElement("div"); total.className="row";
  total.innerHTML = `<div class="small"><strong>Total</strong></div><div><strong>$${(parseFloat(o.total)||0).toFixed(2)}</strong></div>`;

  const status = document.createElement("div"); status.className="small";
  status.innerHTML = `<strong>Estado:</strong> ${o.status||"Pendiente"}`;

  const actions = document.createElement("div"); actions.className="actions";

  const btnPrep = document.createElement("button"); btnPrep.className="btn pending"; btnPrep.innerText="Preparando";
  btnPrep.onclick = ()=> update(ref(db, "pedidos/" + key), { status: "Preparando" });

  const btnListo = document.createElement("button"); btnListo.className="btn prep"; btnListo.innerText="Listo";
  btnListo.onclick = ()=> update(ref(db, "pedidos/" + key), { status: "Listo" });

  const btnEntregado = document.createElement("button"); btnEntregado.className="btn ready"; btnEntregado.innerText="Entregado";
  btnEntregado.onclick = ()=> update(ref(db, "pedidos/" + key), { status: "Entregado" });

  actions.appendChild(btnPrep); actions.appendChild(btnListo); actions.appendChild(btnEntregado);

  // color borde segun estado
  if(o.status === "Preparando") card.style.borderLeft = "6px solid #7bc8ff";
  else if(o.status === "Listo") card.style.borderLeft = "6px solid #7ee88b";
  else if(o.status === "Entregado"){ card.style.borderLeft = "6px solid #d9d9d9"; card.style.opacity="0.6"; }
  else card.style.borderLeft = "6px solid #ffcf33";

  // Append
  card.appendChild(header);
  card.appendChild(cliente);
  card.appendChild(size);
  card.appendChild(salsas);
  card.appendChild(toppings);
  card.appendChild(total);
  card.appendChild(status);
  card.appendChild(actions);

  return card;
}

/* Escuchar en tiempo real */
onValue(ref(db, "pedidos/"), snapshot=>{
  ordersEl.innerHTML = "";
  const data = snapshot.val();
  if(!data) return;
  const entries = Object.entries(data).reverse();
  entries.forEach(([key,o])=>{
    ordersEl.appendChild(createCard(key,o));
  });
});
