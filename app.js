import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

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

function createCard(key, o){
  const card = document.createElement("article");
  card.className = "card";

  const header = document.createElement("div");
  header.className = "row";
  header.innerHTML = `
    <div class="title">Pedido #${key.slice(-6)}</div>
    <div class="small">${o.time || ""}</div>
  `;

  const size = document.createElement("div");
  size.className = "small";
  size.innerHTML = `<strong>Tamaño:</strong> ${o.size || ""}`;

  const toppings = document.createElement("div");
  toppings.className = "list";
  toppings.innerHTML = `<strong>Toppings:</strong><br>${(o.toppings||[]).join("<br>")}`;

  const sauces = document.createElement("div");
  sauces.className = "list";
  sauces.innerHTML = `<strong>Salsas:</strong><br>${(o.sauces||[]).join("<br>")}`;

  const status = document.createElement("div");
  status.className = "small";
  status.innerHTML = `<strong>Estado:</strong> ${o.status || "Pendiente"}`;

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

  actions.append(btnPend, btnListo, btnEntreg);

  // Añadir al card
  card.append(header, size, toppings, sauces, status, actions);

  // Colores del estado
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

onValue(ref(db, "orders"), snapshot => {
  ordersEl.innerHTML = "";
  const data = snapshot.val();
  if(!data) return;

  const entries = Object.entries(data).reverse();

  entries.forEach(([key, o]) => {
    const card = createCard(key, o);
    ordersEl.appendChild(card);
  });
});
