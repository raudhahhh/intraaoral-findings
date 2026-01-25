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
    if (hasIcdas6) {
      goToRdesBtn.style.display = "inline-block";
      if (rdesCompleted) {
        goToRdesBtn.textContent = "Edit RDES";
      } else {
        goToRdesBtn.textContent = "Next → RDES";
      }
    } else {
      goToRdesBtn.style.display = "none";
    }
  }

  /* ===== RDES ===== */
  const rdesData = data.rdes || {};

  // Helper to calculate risk for a single tooth's scores
  function calculateRisk(scores) {
    const values = Object.values(scores);
    const highRiskCount = values.filter(v => v >= 5).length;
    const moderateRiskCount = values.filter(v => v >= 3 && v <= 4).length;

    if (highRiskCount >= 1) return "High risk";
    if (moderateRiskCount >= 2) return "Moderate risk";
    return "Low risk";
  }

  // Generate HTML for each tooth
  const rdesSummaryHTML = Object.entries(rdesData).map(([tooth, scores]) => {
    const risk = calculateRisk(scores);
    let riskClass = "low-risk";
    if (risk === "High risk") riskClass = "high-risk";
    else if (risk === "Moderate risk") riskClass = "moderate-risk";

    return `
      <div class="overall-risk ${riskClass}" style="margin-bottom: 10px;">
        <strong>Tooth ${tooth}:</strong> ${risk}
      </div>
    `;
  }).join("");

  /* ===== HTML ===== */
  summaryContent.innerHTML = `
    <div class="report-section">
      <h3>👄 ORAL HYGIENE</h3>
      <p>
        ${data.oralHealthStatus
      ? `${data.oralHealthStatus} — ${oralHealthDescriptions[data.oralHealthStatus]}`
      : "Not recorded"
    }
      </p>
    </div>

    <div class="report-section">
      <h3>🦷 ICDAS CHART</h3>
      ${icdasEntries.length
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
      ${worstBpeCode
      ? `<p><strong>Code ${worstBpeCode}</strong> — ${bpeTreatmentMap[worstBpeCode]}</p>`
      : "<p>No BPE recorded</p>"
    }
    </div>

  <div class="report-section">
  <h3>🦷 RDES ASSESSMENT</h3>

  ${!hasIcdas6
      ? `<p style="color:#2e7d32; font-weight:600;">
          RDES assessment is not required.
        </p>`
      : rdesCompleted
        ? `<div>${rdesSummaryHTML}</div>`
        : `<p style="color:#f57c00; font-weight:600;">
          RDES assessment required.
        </p>`
    }
</div>


    </div>
  `;
}

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
