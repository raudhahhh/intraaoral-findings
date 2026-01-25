function getPatientData() {
  return JSON.parse(localStorage.getItem("patientData")) || {};
}

const summaryContent = document.getElementById("summaryContent");

/* =========================
   TEXT MAPS
========================= */
const oralHealthDescriptions = {
  Good: "Maintain oral hygiene",
  Moderate: "Reinforcement of oral hygiene instruction",
  Poor: "Reinforcement of oral hygiene instruction"
};

const icdasDetailMap = {
  1: "Fissure sealant",
  2: "Fissure sealant",
  3: "Restoration",
  4: "Restoration",
  5: "Investigation, Pulp Capping, Restoration, RCT, Crown and Bridge",
  6: "Investigation, RCT, RDES, Extraction"
};

const bpeTreatmentMap = {
  "0": "Healthy gingival tissues, no BOP — No treatment",
  "1": "No calculus or defective margins, BOP present — Oral hygiene instruction (OHI)",
  "2": "Colored area fully visible — Scaling and polishing",
  "3": "Colored area partly visible — Scaling and polishing, Periodontal Assessment",
  "4": "Colored area disappears (≥6 mm) — Scaling and polishing, Periodontal Assessment",
  "*": "Furcation involvement"
};

const rdesLabelMap = {
  endodontic: "Endodontic complexity and outcome",
  vertical: "Vertical coronal residual structure",
  horizontal: "Horizontal coronal residual structure",
  seal: "Restoration marginal seal",
  interdisciplinary: "Local interdisciplinary condition",
  planning: "Complexity of treatment planning",
  functional: "Functional need",
  aesthetics: "Dental wear and aesthetics"
};

/* =========================
   RDES HELPERS
========================= */
function rdesRiskLabel(score) {
  if (score <= 2) return "Low";
  if (score <= 4) return "Moderate";
  return "High";
}

function calculateToothRdesRisk(rdesObj) {
  const scores = Object.values(rdesObj);

  // Convert each parameter score → risk label
  const risks = scores.map(rdesRiskLabel);

  if (risks.includes("High")) return "High";
  if (risks.filter(r => r === "Moderate").length >= 2) return "Moderate";
  return "Low";
}


/* =========================
   RENDER SUMMARY
========================= */
if (summaryContent) {
  const data = getPatientData();

  /* ===== ICDAS ===== */
  const icdasEntries = Object.entries(data.icdas || []);
  const hasIcdas6 = icdasEntries.some(
    ([_, code]) => Number(code) === 6
  );
  const rdesCompleted = data.rdesCompleted === true;


  /* ===== BPE ===== */
  const bpeData = JSON.parse(localStorage.getItem("bpeData")) || {};
  const bpeCodes = Object.values(bpeData);

  let worstBpeCode = null;
  if (bpeCodes.length) {
    const order = ["0", "1", "2", "3", "4", "*"];
    worstBpeCode = bpeCodes.reduce(
      (worst, current) =>
        order.indexOf(current) > order.indexOf(worst)
          ? current
          : worst,
      "0"
    );
  }

const goToRdesBtn = document.getElementById("goToRdesBtn");

if (goToRdesBtn) {
  goToRdesBtn.style.display =
    hasIcdas6 && !rdesCompleted ? "inline-block" : "none";
}

  /* ===== RDES ===== */
  const rdesData = data.rdes || {};
  
  /* ===== HTML ===== */
  summaryContent.innerHTML = `
    <div class="report-section">
      <h3>👄 ORAL HYGIENE</h3>
      <p>
        ${
          data.oralHealthStatus
            ? `${data.oralHealthStatus} — ${oralHealthDescriptions[data.oralHealthStatus]}`
            : "Not recorded"
        }
      </p>
    </div>

    <div class="report-section">
      <h3>🦷 ICDAS CHART</h3>
      ${
        icdasEntries.length
          ? icdasEntries.map(
              ([tooth, code]) => `
                <p>
                  🦷 Tooth ${tooth}: ICDAS ${code} —
                  ${icdasDetailMap[code]}
                </p>
              `
            ).join("")
          : "<p>No ICDAS findings recorded</p>"
      }
    </div>

    <div class="report-section">
      <h3>🪥 BASIC PERIODONTAL EXAMINATION</h3>
      ${
        worstBpeCode
          ? `<p><strong>Code ${worstBpeCode}</strong> — ${bpeTreatmentMap[worstBpeCode]}</p>`
          : "<p>No BPE recorded</p>"
      }
    </div>

  <div class="report-section">
  <h3>🦷 RDES ASSESSMENT</h3>

  ${
    !hasIcdas6
      ? `<p style="color:#2e7d32;font-weight:600;">
          RDES assessment is not required.
        </p>`

      : !rdesCompleted
      ? `<p style="color:#f57c00;font-weight:600;">
          RDES assessment required.
        </p>`

      : `
        ${Object.entries(data.rdes).map(([tooth, rdesObj]) => {
          const risk = calculateToothRdesRisk(rdesObj);
          return `
            <p class="rdes-tooth-risk ${risk.toLowerCase()}">
              🦷 Tooth ${tooth} — <strong>${risk.toUpperCase()} RISK</strong>
            </p>
          `;
        }).join("")}
      `
  }
</div>

 `;

/* =========================
   RESET
========================= */
const resetBtn = document.getElementById("resetBtn");

if (resetBtn) {
  resetBtn.addEventListener("click", e => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = "index.html";
  });
}
