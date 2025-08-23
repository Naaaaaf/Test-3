document.addEventListener("DOMContentLoaded", () => {
  const reasons = [
    "blabla",
    "blaaaablaaaa",
    "yadiyadiyaaaa",
  ];

  const pickBtn = document.getElementById("pick-btn");
  const noteContainer = document.getElementById("note-container");

  if (pickBtn) {
    pickBtn.addEventListener("click", () => {
      const reason = reasons[Math.floor(Math.random() * reasons.length)];
      noteContainer.innerHTML = `<div class="note">${reason}</div>`;
    });
  }

  const board = document.getElementById("board");
  if (board) {
    reasons.forEach(r => {
      const pin = document.createElement("div");
      pin.className = "note";
      pin.innerText = r;
      board.appendChild(pin);
    });
  }
});
