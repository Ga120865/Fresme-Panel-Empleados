import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

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

const ordersEl = document.getElementById("orders");

// ------------------------------------------------
// Tarjeta de pedido
// ------------------------------------------------
function createCard(key, o){
  const card = document.createElement("div");
  card.className = "card";

  const header = document.createElement("div");
  header.className = "row";
  header.innerHTML = `
    <div class="title">Pedido #${key.slice(-6)}</div>
    <div class="small">${new Date(o.timestamp).toLocaleTimeString()}</div>
  `;

  const cliente = document.createElement("div");
  cliente.className = "small";
  cliente.innerHTML = `<strong>${o.nombre} ${o.apellido}</strong> — ${o.tipo || ""}`;

  const size = document.createElement("div");
  size.className = "small";
  size.innerHTML = `<strong>Tamaño:</strong> ${o.size} — $${(o.total).toFixed(2)}`;

  const salsas = document.createElement("div");
  salsas.className = "list";
  salsas.innerHTML = `<strong>Salsas:</strong><br>${o.salsas.join("<br>")}`;

  const toppings = document.createElement("div");
  toppings.className = "list";
  toppings.innerHTML = `<strong>Toppings:</strong><br>${o.toppings.join("<br>")}`;

  const status = document.createElement("div");
  status.className = "small";
  status.innerHTML = `<strong>Estado:</strong> ${o.status || "Pendiente"}`;

  // Botones
  const actions = document.createElement("div");
  actions.className = "actions";

  const btnPrep = document.createElement("button");
  btnPrep.className = "btn pending";
  btnPrep.textContent = "Preparando";
  btnPrep.onclick = () => update(ref(db, "pedidos/" + key), { status: "Preparando" });

  const btnListo = document.createElement("button");
  btnListo.className = "btn prep";
  btnListo.textContent = "Listo";
  btnListo.onclick = () => update(ref(db, "pedidos/" + key), { status: "Listo" });

  const btnEntrega = document.createElement("button");
  btnEntrega.className = "btn ready";
  btnEntrega.textContent = "Entregado";
  btnEntrega.onclick = () => update(ref(db, "pedidos/" + key), { status: "Entregado" });

  actions.appendChild(btnPrep);
  actions.appendChild(btnListo);
  actions.appendChild(btnEntrega);

  // BORDER SEGÚN ESTADO
  if(o.status === "Preparando") card.style.borderLeft = "6px solid #7bc8ff";
  else if(o.status === "Listo") card.style.borderLeft = "6px solid #7ee88b";
  else if(o.status === "Entregado") {
    card.style.borderLeft = "6px solid #d9d9d9";
    card.style.opacity = "0.6";
  } else card.style.borderLeft = "6px solid #ffcf33";

  card.appendChild(header);
  card.appendChild(cliente);
  card.appendChild(size);
  card.appendChild(salsas);
  card.appendChild(toppings);
  card.appendChild(status);
  card.appendChild(actions);

  return card;
}


// ------------------------------------------------
// Escuchar pedidos en tiempo real
// ------------------------------------------------
onValue(ref(db, "pedidos"), snapshot => {
  ordersEl.innerHTML = "";
  const data = snapshot.val();
  if(!data) return;

  const entries = Object.entries(data).reverse();
  entries.forEach(([key, pedido]) => {
    ordersEl.appendChild(createCard(key, pedido));
  });
});
