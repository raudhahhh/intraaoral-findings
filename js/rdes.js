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

const RDES_EXPLANATION = {
  endodontic: {
    1: "Vital tooth",
    2: "Necrotic single root with a periapical lesion",
    3: "Necrotic multi-root with a periapical lesion",
    4: "Complex anatomy (calcified and/or additional canals, etc.)",
    5: "Retreatment",
    6: "Complex retreatment (with modification of root anatomy)"
  },
  vertical: {
    1: "Four coronal residual walls",
    2: "Three coronal residual walls",
    3: "Two coronal residual walls",
    4: "One coronal residual wall",
    5: "One coronal residual wall",
    6: "No ferrule"
  },
  horizontal: {
    1: "Absence of cervical lesions or excessive internal structure removal",
    2: "Slight cervical lesion, not requiring restoration",
    3: "Cervical lesion requiring restoration",
    4: "Absence of cervical lesions with excessive internal structure removal",
    5: "Slight cervical lesion requiring restoration",
    6: "Cervical lesion requiring restoration with excessive internal structure removal"
  },
  seal: {
    1: "Margins in enamel and completely supra-gingival",
    2: "Margins partially in enamel and dentin",
    3: "Margins in dentin and supra-gingival",
    4: "Margins placed juxta-gingival",
    5: "Margins placed into the sulcus",
    6: "Margins placed deeply into the sulcus"
  },
  interdisciplinary: {
    1: "No need for interdisciplinary treatment",
    2: "Loss of attachment without periodontal treatment",
    3: "Need for crown lengthening (single tooth)",
    4: "Need for ortho extrusion and crown lengthening",
    5: "Need for ortho extrusion and crown lengthening",
    6: "Need for periodontal surgical therapy"
  },
  planning: {
    1: "Single tooth in a virgin quadrant",
    2: "Single tooth with other restored teeth",
    3: "Tooth as abutment of a multiunit bridge",
    4: "Tooth as terminal distal abutment",
    5: "Tooth as abutment of a full arch rehabilitation",
    6: "Tooth as distal terminal abutment of full arch rehabilitation"
  },
  functional: {
    1: "Free-standing restoration in favourable occlusion",
    2: "Free-standing restoration in unfavourable occlusion",
    3: "Short/medium span bridge (favourable occlusion)",
    4: "Short/medium span bridge (unfavourable occlusion)",
    5: "Long span bridge (favourable occlusion)",
    6: "Long span bridge (unfavourable occlusion)"
  },
  aesthetics: {
    1: "No dental wear and no aesthetic needs",
    2: "Slight aesthetic need and slight dental wear",
    3: "Aesthetic needs and mild dental wear",
    4: "High aesthetic need and heavy dental wear",
    5: "High aesthetic need and severe dental wear",
    6: "Compromised function due to dental wear"
  }
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
  const row = scoreCell.closest("tr");
  const explanationCell = row.querySelector(".rdes-explanation");
  const savedScore = rdesData[key] || 1;

  scoreCell.textContent = savedScore;
  scoreCell.classList.remove("rdes-low", "rdes-moderate", "rdes-high");

  if (savedScore <= 2) scoreCell.classList.add("rdes-low");
  else if (savedScore <= 4) scoreCell.classList.add("rdes-moderate");
  else scoreCell.classList.add("rdes-high");

  explanationCell.textContent =
    RDES_EXPLANATION[key][savedScore];

  scoreCell.addEventListener("click", () => {
    let next = Number(scoreCell.textContent) === 6 ? 1 : Number(scoreCell.textContent) + 1;

    scoreCell.textContent = next;
    scoreCell.className = "rdes-score";

    if (next <= 2) scoreCell.classList.add("rdes-low");
    else if (next <= 4) scoreCell.classList.add("rdes-moderate");
    else scoreCell.classList.add("rdes-high");

    explanationCell.textContent =
      RDES_EXPLANATION[key][next];

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
