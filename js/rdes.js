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
   LOAD / INIT DATA
========================= */
const patientData = JSON.parse(localStorage.getItem("patientData")) || {};
const icdasData = patientData.icdas || {};

// Find teeth with ICDAS score 6
const affectedTeeth = Object.keys(icdasData).filter(
  tooth => Number(icdasData[tooth]) === 6
);

// Initialize RDES data structure if needed
// New structure: { "18": { ...scores }, "24": { ...scores } }
let rdesData = patientData.rdes || {};

// Ensure each affected tooth has an entry
affectedTeeth.forEach(tooth => {
  if (!rdesData[tooth]) {
    rdesData[tooth] = { ...DEFAULT_RDES };
  }
});

// Clean up entries for teeth that no longer have score 6 (optional, but good for hygiene)
Object.keys(rdesData).forEach(tooth => {
  if (Number(icdasData[tooth]) !== 6) {
    delete rdesData[tooth];
  }
});

/* =========================
   UI GENERATION
========================= */
const container = document.getElementById("rdes-container");

if (container && affectedTeeth.length > 0) {
  // 1. Create Tabs Header
  const tabsHeader = document.createElement("div");
  tabsHeader.className = "tabs-header";

  // 2. Create Content Container
  const contentContainer = document.createElement("div");

  affectedTeeth.forEach((tooth, index) => {
    // --- TAB BUTTON ---
    const btn = document.createElement("button");
    btn.className = `tab-btn ${index === 0 ? "active" : ""}`;
    btn.textContent = `Tooth ${tooth}`;
    btn.dataset.target = `tab-${tooth}`;

    btn.addEventListener("click", () => {
      // Deactivate all
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));

      // Activate current
      btn.classList.add("active");
      document.getElementById(`tab-${tooth}`).classList.add("active");
    });

    tabsHeader.appendChild(btn);

    // --- TAB PANE (TABLE) ---
    const pane = document.createElement("div");
    pane.id = `tab-${tooth}`;
    pane.className = `tab-pane ${index === 0 ? "active" : ""}`;

    pane.innerHTML = `
      <table class="rdes-table">
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Score</th>
            <th>Clinical Explanation</th>
          </tr>
        </thead>
        <tbody>
          ${Object.keys(DEFAULT_RDES).map(key => `
            <tr>
              <td>${formatKey(key)}</td>
              <td class="rdes-score" data-tooth="${tooth}" data-key="${key}">
                ${rdesData[tooth][key]}
              </td>
              <td class="rdes-explanation" id="exp-${tooth}-${key}">
                ${RDES_EXPLANATION[key][rdesData[tooth][key]]}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;

    contentContainer.appendChild(pane);
  });

  container.appendChild(tabsHeader);
  container.appendChild(contentContainer);

  // Add event listeners to the new dynamic scores
  attachScoreListeners();

} else if (container) {
  container.innerHTML = "<p>No teeth with ICDAS Score 6 found.</p>";
}

function formatKey(key) {
  const labels = {
    endodontic: "Endodontic complexity and outcome",
    vertical: "Vertical coronal residual structure",
    horizontal: "Horizontal coronal residual structure",
    seal: "Restoration marginal seal",
    interdisciplinary: "Local interdisciplinary condition",
    planning: "Complexity of treatment planning",
    functional: "Functional need",
    aesthetics: "Dental wear and aesthetics"
  };
  return labels[key] || key;
}

/* =========================
   INTERACTION
========================= */
function attachScoreListeners() {
  document.querySelectorAll(".rdes-score").forEach(cell => {
    const tooth = cell.dataset.tooth;
    const key = cell.dataset.key;
    const explanationCell = document.getElementById(`exp-${tooth}-${key}`);

    updateScoreUI(cell, explanationCell, key, rdesData[tooth][key]);

    cell.addEventListener("click", () => {
      let score = rdesData[tooth][key];
      score = score === 6 ? 1 : score + 1;

      // Update Data
      rdesData[tooth][key] = score;

      // Update UI
      updateScoreUI(cell, explanationCell, key, score);
    });
  });
}

function updateScoreUI(scoreCell, explanationCell, key, score) {
  scoreCell.textContent = score;

  // Reset classes
  scoreCell.className = "rdes-score";

  if (score <= 2) scoreCell.classList.add("rdes-low");
  else if (score <= 4) scoreCell.classList.add("rdes-moderate");
  else scoreCell.classList.add("rdes-high");

  explanationCell.textContent = RDES_EXPLANATION[key][score];
}

/* =========================
   NEXT → SUMMARY
========================= */
const nextBtn = document.getElementById("nextBtn");

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    patientData.rdes = rdesData;
    patientData.rdesCompleted = true;
    localStorage.setItem("patientData", JSON.stringify(patientData));
    window.location.href = "summary.html";
  });
}
