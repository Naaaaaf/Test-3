// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue, get } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDuNIDwSpNLTQb9fYSzSLnMBsc5v-Cm2G4",
  authDomain: "reasons-try-1-with-fb.firebaseapp.com",
  projectId: "reasons-try-1-with-fb",
  storageBucket: "reasons-try-1-with-fb.firebasestorage.app",
  messagingSenderId: "516625580067",
  appId: "1:516625580067:web:54db48d0cbbe3e923a7196",
  measurementId: "G-BS9XQE7PF2",
  databaseURL: "https://reasons-try-1-with-fb-default-rtdb.firebaseio.com/"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM Elements
const pickBtn = document.getElementById("pickBtn");
const paper = document.getElementById("paper");
const paperText = document.getElementById("paper-text");
const pinnedBoard = document.getElementById("pinnedBoard");

let reasons = [];
let openedReason = null;

// Load reasons from Firebase
async function loadReasons() {
  const snapshot = await get(ref(db, "reasons"));
  if (snapshot.exists()) {
    reasons = Object.values(snapshot.val());
  } else {
    reasons = [];
  }
}

// Pick random reason
function pickReason() {
  if (reasons.length === 0) {
    alert("Come back later! ;)");
    return;
  }

  const reason = reasons[Math.floor(Math.random() * reasons.length)];
  openedReason = reason;

  // Show paper unfolding animation
  paperText.textContent = reason;
  paper.style.display = "block";
  setTimeout(() => {
    paper.classList.add("unfold");
  }, 50);

  // Save to pinned in Firebase
  setTimeout(() => {
    const newKey = push(ref(db, "pinned")).key;
    set(ref(db, "pinned/" + newKey), reason);
  }, 1500);
}

// Display pinned reasons
function displayPinnedReasons(list) {
  pinnedBoard.innerHTML = "";
  list.forEach(reason => {
    const note = document.createElement("div");
    note.className = "note";
    note.textContent = reason;
    pinnedBoard.appendChild(note);
  });
}

// Listen for pinned reasons in real-time
onValue(ref(db, "pinned"), (snapshot) => {
  const pinned = snapshot.val();
  if (pinned) {
    displayPinnedReasons(Object.values(pinned));
  }
});

// Event Listeners
pickBtn.addEventListener("click", pickReason);

document.body.addEventListener("click", (e) => {
  if (openedReason && e.target !== pickBtn) {
    paper.classList.remove("unfold");
    paper.style.display = "none";
    openedReason = null;
  }
});

// Init
loadReasons();
