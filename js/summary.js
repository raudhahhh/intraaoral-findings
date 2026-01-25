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

/* =========================
   RDES HELPERS
========================= */
function rdesRiskLabel(score) {
  if (score <= 2) return "Low";
  if (score <= 4) return "Moderate";
  return "High";
}

function calculateToothRdesRisk(rdesObj) {
  const risks = Object.values(rdesObj).map(rdesRiskLabel);
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
  const icdasEntries = Object.entries(data.icdas || {});
  const hasIcdas6 = icdasEntries.some(([_, c]) => Number(c) === 6);
  const rdesCompleted = data.rdesCompleted === true;

  /* ===== BPE ===== */
  const bpeData = JSON.parse(localStorage.getItem("bpeData")) || {};
  const bpeCodes = Object.values(bpeData);
  const order = ["0", "1", "2", "3", "4", "*"];

  const worstBpeCode = bpeCodes.length
    ? bpeCodes.reduce(
        (a, b) => (order.indexOf(b) > order.indexOf(a) ? b : a),
        "0"
      )
    : null;

  /* ===== RDES ===== */
  const rdesData = data.rdes || {};
  const isPerTooth = Object.values(rdesData).every(
    v => typeof v === "object" && v !== null
  );

  summaryContent.innerHTML = `
    <div class="report-section">
      <h3>👄 ORAL HYGIENE</h3>
      <p>${data.oralHealthStatus
        ? `${data.oralHealthStatus} — ${oralHealthDescriptions[data.oralHealthStatus]}`
        : "Not recorded"}</p>
    </div>

    <div class="report-section">
      <h3>🦷 ICDAS CHART</h3>
      ${icdasEntries.length
        ? icdasEntries.map(([t, c]) =>
            `<p>🦷 Tooth ${t}: ICDAS ${c} — ${icdasDetailMap[c]}</p>`
          ).join("")
        : "<p>No ICDAS findings recorded</p>"}
    </div>

    <div class="report-section">
      <h3>🪥 BASIC PERIODONTAL EXAMINATION</h3>
      ${worstBpeCode
        ? `<p><strong>Code ${worstBpeCode}</strong> — ${bpeTreatmentMap[worstBpeCode]}</p>`
        : "<p>No BPE recorded</p>"}
    </div>

    <div class="report-section">
      <h3>🦷 RDES ASSESSMENT</h3>

      ${!hasIcdas6
        ? `<p class="rdes-tooth-risk low">RDES not required</p>`
        : !rdesCompleted
        ? `<p class="rdes-tooth-risk moderate">RDES assessment required</p>`
        : !isPerTooth
        ? `<p class="rdes-tooth-risk high">RDES data incomplete</p>`
        : Object.entries(rdesData).map(([tooth, rdesObj]) => {
            const risk = calculateToothRdesRisk(rdesObj);
            return `
              <p class="rdes-tooth-risk ${risk.toLowerCase()}">
                🦷 Tooth ${tooth} — <strong>${risk.toUpperCase()} RISK</strong>
              </p>`;
          }).join("")}
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
