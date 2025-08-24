import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Firebase Config (same as script.js)
const firebaseConfig = { /* ... same config ... */ };
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const form = document.getElementById("reasonForm");
const input = document.getElementById("newReason");
const list = document.getElementById("reasonList");

// Add new reason
form.addEventListener("submit", (e) => {
  e.preventDefault();
  push(ref(db, "reasons"), input.value);
  input.value = "";
});

// Show all reasons
onValue(ref(db, "reasons"), (snapshot) => {
  list.innerHTML = "";
  if (snapshot.exists()) {
    const data = snapshot.val();
    Object.values(data).forEach(reason => {
      const li = document.createElement("li");
      li.textContent = reason;
      list.appendChild(li);
    });
  }
});

