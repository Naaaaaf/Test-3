/*******************************
 🔹 Firebase Setup
*******************************/
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Init Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database(app);

/*******************************
 🔹 DOM Elements
*******************************/
const pickBtn = document.getElementById("pickBtn");
const paper = document.getElementById("paper");
const paperText = document.getElementById("paper-text");
const pinnedBoard = document.getElementById("pinnedBoard");

let reasons = {};
let openedReason = null;

/*******************************
 🔹 Fetch Reasons from Firebase
*******************************/
function loadReasons() {
  firebase.database().ref("reasons").once("value").then(snapshot => {
    reasons = snapshot.val() || {};
  });
}

/*******************************
 🔹 Pick Random Reason
*******************************/
function pickReason() {
  const keys = Object.keys(reasons);
  if (keys.length === 0) {
    alert("No reasons found! Add some in Firebase.");
    return;
  }

  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  const reason = reasons[randomKey];

  openedReason = reason;

  // Show unfolding animation
  paperText.textContent = reason;
  paper.classList.add("unfold");
  paper.style.display = "block";

  // Save to Firebase after a short delay (so animation feels natural)
  setTimeout(() => {
    pinReason(reason);
  }, 1500);
}

/*******************************
 🔹 Save Reason to Firebase
*******************************/
function pinReason(reason) {
  const newKey = firebase.database().ref().child("pinned").push().key;
  firebase.database().ref("pinned/" + newKey).set(reason);
}

/*******************************
 🔹 Listen for Pinned Reasons
*******************************/
firebase.database().ref("pinned").on("value", snapshot => {
  const pinned = snapshot.val() || {};
  displayPinnedReasons(Object.values(pinned));
});

/*******************************
 🔹 Display Pinned Reasons
*******************************/
function displayPinnedReasons(list) {
  pinnedBoard.innerHTML = "";
  list.forEach(reason => {
    const note = document.createElement("div");
    note.className = "note";
    note.textContent = reason;
    pinnedBoard.appendChild(note);
  });
}

/*******************************
 🔹 Event Listeners
*******************************/
pickBtn.addEventListener("click", pickReason);

// Clicking anywhere hides paper (after opening)
document.body.addEventListener("click", (e) => {
  if (openedReason && e.target !== pickBtn) {
    paper.classList.remove("unfold");
    paper.style.display = "none";
    openedReason = null;
  }
});

/*******************************
 🔹 Init
*******************************/
loadReasons();
