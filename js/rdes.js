const DEFAULT_RDES = {
  endodontic : 1,
  vertical: 1,
  horizontal: 1,
  seal: 1,
  interdisciplinary: 1,
  planning: 1,
  functional: 1,
  aesthetics: 1
};

const scores = document.querySelectorAll(".rdes-score");
let rdesData = {
  ...DEFAULT_RDES,
  ...(JSON.parse(localStorage.getItem("rdesData")) || {})
};

function getRiskLabel(score) {
  if (score <= 2) return "Low";
  if (score <= 4) return "Moderate";
  return "High";
}

function applyRiskColour(riskCell, score) {
  riskCell.classList.remove("rdes-low", "rdes-moderate", "rdes-high");

  if (score <= 2) riskCell.classList.add("rdes-low");
  else if (score <= 4) riskCell.classList.add("rdes-moderate");
  else riskCell.classList.add("rdes-high");
}

// INIT + CLICK
scores.forEach(scoreCell => {
  const key = scoreCell.dataset.key;
  const riskCell = scoreCell.nextElementSibling;

  // load saved
  const savedScore = rdesData[key] || 1;
  scoreCell.textContent = savedScore;
  riskCell.textContent = getRiskLabel(savedScore);
  applyRiskColour(riskCell, savedScore);

  // click to cycle
  scoreCell.addEventListener("click", () => {
    let current = Number(scoreCell.textContent);
    let next = current === 6 ? 1 : current + 1;

    scoreCell.textContent = next;
    riskCell.textContent = getRiskLabel(next);
    applyRiskColour(riskCell, next);

    rdesData[key] = next;
    localStorage.setItem("rdesData", JSON.stringify(rdesData));
  });
});

// NEXT BUTTON
const nextBtn = document.getElementById("nextBtn");

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    const patientData =
      JSON.parse(localStorage.getItem("patientData")) || {};

    patientData.rdes = rdesData;
    localStorage.setItem("patientData", JSON.stringify(patientData));

    window.location.href = "summary.html";
  });
}
