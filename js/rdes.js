/* =========================
   RDES EXPLANATIONS
========================= */
const RDES_EXPLANATION = {
  endodontic: {
    1: "Vital tooth",
    2: "Necrotic single root with a periapical lesion",
    3: "Necrotic multi-root with a periapical lesion",
    4: "Complex anatomy",
    5: "Retreatment",
    6: "Complex retreatment"
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
    1: "No cervical lesion",
    2: "Slight cervical lesion",
    3: "Cervical lesion requiring restoration",
    4: "Excessive internal structure removal",
    5: "Cervical lesion + restoration",
    6: "Severe cervical lesion"
  },
  seal: {
    1: "Margins in enamel",
    2: "Margins in enamel & dentin",
    3: "Margins in dentin",
    4: "Juxta-gingival margins",
    5: "Margins into sulcus",
    6: "Deep sulcus margins"
  },
  interdisciplinary: {
    1: "No interdisciplinary treatment",
    2: "Attachment loss only",
    3: "Crown lengthening required",
    4: "Ortho extrusion required",
    5: "Ortho + crown lengthening",
    6: "Periodontal surgery required"
  },
  planning: {
    1: "Single tooth",
    2: "Tooth among restored teeth",
    3: "Bridge abutment",
    4: "Terminal abutment",
    5: "Full arch rehabilitation",
    6: "Distal terminal abutment"
  },
  functional: {
    1: "Favourable occlusion",
    2: "Unfavourable occlusion",
    3: "Short bridge",
    4: "Short bridge unfavourable",
    5: "Long bridge",
    6: "Long bridge unfavourable"
  },
  aesthetics: {
    1: "No aesthetic need",
    2: "Slight aesthetic need",
    3: "Mild wear",
    4: "High aesthetic need",
    5: "Severe wear",
    6: "Compromised function"
  }
};

/* =========================
   LOAD PATIENT DATA
========================= */
const patientData =
  JSON.parse(localStorage.getItem("patientData")) || {};

patientData.rdes = patientData.rdes || {};

/* =========================
   FIND ICDAS 6 TEETH
========================= */
const icdas6Teeth = Object.entries(patientData.icdas || {})
  .filter(([_, code]) => Number(code) === 6)
  .map(([tooth]) => tooth);

/* =========================
   DEFAULT RDES PER TOOTH
========================= */
function createDefaultRDES() {
  return {
    endodontic: 1,
    vertical: 1,
    horizontal: 1,
    seal: 1,
    interdisciplinary: 1,
    planning: 1,
    functional: 1,
    aesthetics: 1
  };
}

icdas6Teeth.forEach(tooth => {
  if (!patientData.rdes[tooth]) {
    patientData.rdes[tooth] = createDefaultRDES();
  }
});

/* =========================
   RENDER TABLES
========================= */
const rdesContainer = document.getElementById("rdesContainer");
rdesContainer.innerHTML = "";

icdas6Teeth.forEach(tooth => {
  const rdes = patientData.rdes[tooth];

  const tableHTML = `
    <div class="report-section">
      <h3>🦷 Tooth ${tooth}</h3>

      <table class="rdes-table" data-tooth="${tooth}">
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Score</th>
            <th>Clinical Explanation</th>
          </tr>
        </thead>
        <tbody>
          ${Object.keys(rdes).map(key => `
            <tr>
              <td>${key.replace(/([A-Z])/g, " $1")}</td>
              <td class="rdes-score" data-tooth="${tooth}" data-key="${key}">
                ${rdes[key]}
              </td>
              <td class="rdes-explanation">
                ${RDES_EXPLANATION[key][rdes[key]]}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;

  rdesContainer.insertAdjacentHTML("beforeend", tableHTML);
});

/* =========================
   SCORE INTERACTION
========================= */
document.querySelectorAll(".rdes-score").forEach(scoreCell => {
  const tooth = scoreCell.dataset.tooth;
  const key = scoreCell.dataset.key;
  const explanationCell =
    scoreCell.closest("tr").querySelector(".rdes-explanation");

  let score = patientData.rdes[tooth][key];
  updateScoreUI(scoreCell, explanationCell, key, score);

  scoreCell.addEventListener("click", () => {
    score = score === 6 ? 1 : score + 1;
    patientData.rdes[tooth][key] = score;

    updateScoreUI(scoreCell, explanationCell, key, score);
    localStorage.setItem("patientData", JSON.stringify(patientData));
  });
});

/* =========================
   UI UPDATE
========================= */
function updateScoreUI(scoreCell, explanationCell, key, score) {
  scoreCell.textContent = score;
  scoreCell.className = "rdes-score";

  if (score <= 2) scoreCell.classList.add("rdes-low");
  else if (score <= 4) scoreCell.classList.add("rdes-moderate");
  else scoreCell.classList.add("rdes-high");

  explanationCell.textContent = RDES_EXPLANATION[key][score];
}

/* =========================
   NEXT → SUMMARY
========================= */
document.getElementById("nextBtn").addEventListener("click", () => {
  patientData.rdesCompleted = true;
  localStorage.setItem("patientData", JSON.stringify(patientData));
  window.location.href = "summary.html";
});
