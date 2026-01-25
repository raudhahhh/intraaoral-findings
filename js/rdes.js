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

if (icdas6Teeth.length === 0) {
  alert("No ICDAS 6 teeth found. RDES not required.");
  window.location.href = "summary.html";
}

/* =========================
   DEFAULT RDES
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
   DOM
========================= */
const tabsContainer = document.getElementById("rdesTabs");
const rdesContainer = document.getElementById("rdesContainer");
const nextBtn = document.getElementById("nextBtn");

let activeTooth = icdas6Teeth[0];

/* =========================
   HELPERS
========================= */
function applyRiskColour(cell, score) {
  cell.classList.remove("rdes-low", "rdes-moderate", "rdes-high");
  if (score <= 2) cell.classList.add("rdes-low");
  else if (score <= 4) cell.classList.add("rdes-moderate");
  else cell.classList.add("rdes-high");
}

/* =========================
   TABS
========================= */
function renderTabs() {
  if (!tabsContainer) return;

  tabsContainer.innerHTML = icdas6Teeth.map(tooth => `
    <button
      class="rdes-tab ${tooth === activeTooth ? "active" : ""}"
      data-tooth="${tooth}">
      Tooth ${tooth}
    </button>
  `).join("");

  tabsContainer.querySelectorAll(".rdes-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      activeTooth = btn.dataset.tooth;
      renderTabs();
      renderTable(activeTooth);
    });
  });
}

/* =========================
   TABLE
========================= */
function renderTable(tooth) {
  const rdes = patientData.rdes[tooth];

  rdesContainer.innerHTML = `
    <div class="report-section">
      <h3>🦷 Tooth ${tooth}</h3>
      <table class="rdes-table">
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
              <td class="rdes-score" data-key="${key}">${rdes[key]}</td>
              <td class="rdes-explanation">
                ${RDES_EXPLANATION[key][rdes[key]]}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;

  attachScoreHandlers(tooth);
}

/* =========================
   INTERACTION
========================= */
function attachScoreHandlers(tooth) {
  rdesContainer.querySelectorAll(".rdes-score").forEach(cell => {
    const key = cell.dataset.key;
    const explanationCell = cell.nextElementSibling;

    let score = patientData.rdes[tooth][key];
    applyRiskColour(cell, score);

    cell.addEventListener("click", () => {
      score = score === 6 ? 1 : score + 1;
      patientData.rdes[tooth][key] = score;

      cell.textContent = score;
      explanationCell.textContent = RDES_EXPLANATION[key][score];
      applyRiskColour(cell, score);

      localStorage.setItem("patientData", JSON.stringify(patientData));
    });
  });
}

/* =========================
   INIT
========================= */
renderTabs();
renderTable(activeTooth);

/* =========================
   NEXT
========================= */
nextBtn.addEventListener("click", () => {
  patientData.rdesCompleted = true;
  localStorage.setItem("patientData", JSON.stringify(patientData));
  window.location.href = "summary.html";
});
