// ✅ Firebase Setup
const firebaseConfig = {
  apiKey: "YOUR-API-KEY",
  authDomain: "YOUR-PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR-PROJECT.firebaseio.com",
  projectId: "YOUR-PROJECT",
  storageBucket: "YOUR-PROJECT.appspot.com",
  messagingSenderId: "xxxxxxx",
  appId: "xxxxxxx"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const pickBtn = document.getElementById("pickReason");
const paper = document.getElementById("paper");
const reasonText = document.getElementById("reasonText");
const pinnedContainer = document.getElementById("pinnedContainer");

// Load reasons from Firebase
let reasons = [];
db.ref("reasons").on("value", snapshot => {
  reasons = snapshot.val() ? Object.values(snapshot.val()) : [];
});

// Show pinned reasons live
db.ref("pinned").on("child_added", snapshot => {
  const reason = snapshot.val();
  const note = document.createElement("div");
  note.classList.add("pinnedNote");
  note.innerText = reason;
  pinnedContainer.appendChild(note);
});

// Pick random reason
pickBtn.addEventListener("click", () => {
  if (reasons.length === 0) return alert("No reasons yet!");

  const randomReason = reasons[Math.floor(Math.random() * reasons.length)];
  reasonText.innerText = randomReason;
  paper.classList.add("show");
  paper.classList.remove("hidden");

  // On click anywhere, pin it
  document.body.onclick = (e) => {
    if (!paper.contains(e.target) && paper.classList.contains("show")) {
      db.ref("pinned").push(randomReason);
      paper.classList.remove("show");
      paper.classList.add("hidden");
    }
  };
});
