/* =========================
   DEFAULT RDES VALUES
========================= */
const DEFAULT_RDES = {
  endodontic: 1,
  vertical: 1,
  horizontal: 1,
  seal: 1,
  interdisciplinary: 1,
  planning: 1,
  functional: 1,
  aesthetics: 1
};

/* =========================
   LOAD PATIENT + ICDAS
========================= */
const patientData =
  JSON.parse(localStorage.getItem("patientData")) || {};

const icdasData = patientData.icdas || {};

/* =========================
   FIND ICDAS 6 TEETH ONLY
========================= */
const icdas6Teeth = Object.entries(icdasData)
  .filter(([_, code]) => code === 6)
  .map(([tooth]) => tooth);

/* =========================
   ICDAS SUMMARY (ONLY 6)
========================= */
const icdasSummary = document.getElementById("icdasSummary");

if (icdasSummary) {
  if (icdas6Teeth.length === 0) {
    icdasSummary.innerHTML = `
      <p style="color:#2e7d32; font-weight:600;">
        No ICDAS 6 detected — RDES assessment not required.
      </p>
    `;
  } else {
    icdasSummary.innerHTML = `
      <h3>🦷 Teeth Requiring RDES (ICDAS 6)</h3>
      ${icdas6Teeth.map(
        tooth => `<p>Tooth ${tooth}: ICDAS 6</p>`
      ).join("")}
    `;
  }
}

/* =========================
   HIDE RDES TABLE IF NOT NEEDED
========================= */
const rdesTable = document.querySelector(".rdes-table");

if (icdas6Teeth.length === 0 && rdesTable) {
  rdesTable.style.display = "none";
}

/* =========================
   LOAD / INIT RDES DATA
========================= */
let rdesData = {
  ...DEFAULT_RDES,
  ...(JSON.parse(localStorage.getItem("rdesData")) || {})
};

localStorage.setItem("rdesData", JSON.stringify(rdesData));

/* =========================
   RISK HELPERS
========================= */
function getRiskLabel(score) {
  if (score <= 2) return "Low";
  if (score <= 4) return "Moderate";
  return "High";
}

function applyRiskColour(riskCell, score) {
  riskCell.classList.remove(
    "rdes-low",
    "rdes-moderate",
    "rdes-high"
  );

  if (score <= 2) riskCell.classList.add("rdes-low");
  else if (score <= 4) riskCell.classList.add("rdes-moderate");
  else riskCell.classList.add("rdes-high");
}

/* =========================
   INIT SCORE CELLS
========================= */
const scoreCells = document.querySelectorAll(".rdes-score");

scoreCells.forEach(scoreCell => {
  const key = scoreCell.dataset.key;
  const riskCell = scoreCell.nextElementSibling;

  const score = rdesData[key] || 1;

  scoreCell.textContent = score;
  riskCell.textContent = getRiskLabel(score);
  applyRiskColour(riskCell, score);

  scoreCell.addEventListener("click", () => {
    let next = Number(scoreCell.textContent) + 1;
    if (next > 6) next = 1;

    scoreCell.textContent = next;
    riskCell.textContent = getRiskLabel(next);
    applyRiskColour(riskCell, next);

    rdesData[key] = next;
    localStorage.setItem("rdesData", JSON.stringify(rdesData));
  });
});

/* =========================
   NEXT → SUMMARY
========================= */
const nextBtn = document.getElementById("nextBtn");

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    patientData.rdes = rdesData;
    localStorage.setItem("patientData", JSON.stringify(patientData));
    window.location.href = "summary.html";
  });
}
