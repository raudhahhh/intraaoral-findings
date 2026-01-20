/* =========================
   BPE LOGIC ONLY
========================= */

const codes = ["0", "1", "2", "3", "4", "*"];
let bpeData = JSON.parse(localStorage.getItem("bpeData")) || {};

const sextants = document.querySelectorAll(".sextant");

// Load saved BPE data
sextants.forEach(cell => {
  const sextant = cell.dataset.sextant;

  if (bpeData[sextant]) {
    cell.textContent = bpeData[sextant];
    updateColor(cell, bpeData[sextant]);
  }

  cell.addEventListener("click", () => {
    let current = cell.textContent;
    let index = codes.indexOf(current);
    let next = codes[(index + 1) % codes.length];

    cell.textContent = next;
    updateColor(cell, next);

    bpeData[sextant] = next;
    localStorage.setItem("bpeData", JSON.stringify(bpeData));
  });
});

function updateColor(cell, code) {
  cell.className = "sextant";
  if (code === "*") {
    cell.classList.add("code-star");
  } else {
    cell.classList.add(`code-${code}`);
  }
}

// Next → Summary
const nextBtn = document.getElementById("nextBtn");

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    window.location.href = "summary.html";
  });
}
