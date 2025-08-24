import { collection, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const db = window.db;

const button = document.getElementById('pickReason');
const note = document.getElementById('note');
const reasonText = document.getElementById('reasonText');

let reasons = [];

// Fetch all reasons from Firestore
async function loadReasons() {
  try {
    const querySnapshot = await getDocs(collection(db, "reasons"));
    reasons = querySnapshot.docs.map(doc => doc.data().text);

    if (reasons.length === 0) {
      reasonText.textContent = "No reasons yet 💭";
    }
  } catch (err) {
    console.error("Error fetching reasons:", err);
    reasonText.textContent = "Error loading reasons ⚠️";
  }
}

// Save opened reason into Firestore
async function logOpenedReason(reason) {
  try {
    await addDoc(collection(db, "openedReasons"), {
      text: reason,
      openedAt: serverTimestamp()
    });
    console.log("Logged:", reason);
  } catch (err) {
    console.error("Error logging reason:", err);
  }
}

// When button is clicked
button.addEventListener('click', () => {
  if (reasons.length === 0) return;

  const randomIndex = Math.floor(Math.random() * reasons.length);
  const reason = reasons[randomIndex];

  reasonText.textContent = reason;
  note.classList.remove('hidden');

  // restart animation
  note.classList.remove('show');
  void note.offsetWidth; 
  note.classList.add('show');

  // log into Firestore
  logOpenedReason(reason);
});

// Load reasons when the page loads
loadReasons();
