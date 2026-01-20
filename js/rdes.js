const scores = document.querySelectorAll(".rdes-score");
let rdesData = JSON.parse(localStorage.getItem("rdesData")) || {};

function getRiskLabel(score) {
  if (score <= 2) return "Low";
  if (score <= 4) return "Moderate";
  return "High";
}

// Load saved data
scores.forEach(cell => {
  const key = cell.dataset.key;

  if (rdesData[key]) {
    cell.textContent = rdesData[key];
  }

  const riskCell = cell.nextElementSibling;
  riskCell.textContent = getRiskLabel(Number(cell.textContent));

  cell.addEventListener("click", () => {
    let current = Number(cell.textContent);
    let next = current === 6 ? 1 : current + 1;

    cell.textContent = next;
    riskCell.textContent = getRiskLabel(next);

    rdesData[key] = next;
    localStorage.setItem("rdesData", JSON.stringify(rdesData));
  });
});

// Next → Summary
document.getElementById("nextBtn").addEventListener("click", () => {
  window.location.href = "summary.html";
});

