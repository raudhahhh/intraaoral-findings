function getPatientData() {
  return JSON.parse(localStorage.getItem("patientData")) || {};
}

function savePatientData(data) {
  localStorage.setItem("patientData", JSON.stringify(data));
}

const scores = document.querySelectorAll(".rdes-score");
let rdesData = JSON.parse(localStorage.getItem("rdesData")) || {};

function getRiskLabel(score) {
  if (score <= 2) return "Low";
  if (score <= 4) return "Moderate";
  return "High";
}

function applyRiskColour(riskCell, score) {
  if (!riskCell) return;

  riskCell.classList.remove("rdes-low", "rdes-moderate", "rdes-high");

  if (score <= 2) riskCell.classList.add("rdes-low");
  else if (score <= 4) riskCell.classList.add("rdes-moderate");
  else riskCell.classList.add("rdes-high");
}

// Load saved data
scores.forEach(cell => {
  const key = cell.dataset.key;

  if (rdesData[key]) {
    cell.textContent = rdesData[key];
  }

  const riskCell = cell.nextElementSibling;
  const score = Number(cell.textContent);

  riskCell.textContent = getRiskLabel(score);
  applyRiskColour(riskCell, score);

  cell.addEventListener("click", () => {
    let current = Number(cell.textContent);
    let next = current === 6 ? 1 : current + 1;

    cell.textContent = next;
    riskCell.textContent = getRiskLabel(next);
    applyRiskColour(riskCell, next);

    rdesData[key] = next;
    localStorage.setItem("rdesData", JSON.stringify(rdesData));
  });
});

// Next → Summary
const nextBtn = document.getElementById("nextBtn");

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    const patientData = getPatientData();
    patientData.rdes = rdesData;
    savePatientData(patientData);

    window.location.href = "summary.html";
  });
}
