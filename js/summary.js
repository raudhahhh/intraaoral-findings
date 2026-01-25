/* =========================
        HELPER
========================= */
function getPatientData() {
  return JSON.parse(localStorage.getItem("patientData")) || {};
}

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

function isRdesFullyReviewed(rdesData) {
  return Object.values(rdesData).every(toothObj =>
    Object.values(toothObj).some(score => score > 1)
  );
}

/* =========================
        NORMALIZE
========================= */
const data = getPatientData();

data.icdas = data.icdas || {};
data.rdes = data.rdes || {};

localStorage.setItem("patientData", JSON.stringify(data));

/* =========================
        DOM
========================= */
const summaryContent = document.getElementById("summaryContent");
const goToRdesBtn = document.getElementById("goToRdesBtn");

/* =========================
        BUTTON VISIBILITY
========================= */
const hasIcdas6 = Object.values(data.icdas).some(v => Number(v) === 6);
const rdesReviewed = isRdesFullyReviewed(data.rdes);

if (goToRdesBtn) {
  goToRdesBtn.style.display =
    hasIcdas6 && !rdesReviewed ? "inline-block" : "none";
}

/* =========================
        RENDER
========================= */
if (summaryContent) {
  const icdasEntries = Object.entries(data.icdas);

  summaryContent.innerHTML = `
    <div class="report-section">
      <h3>🦷 RDES ASSESSMENT</h3>

      ${
        !hasIcdas6
          ? `<p class="rdes-tooth-risk low">RDES not required</p>`
          : !rdesReviewed
          ? `<p class="rdes-tooth-risk moderate">
              RDES assessment required — please complete all ICDAS 6 teeth
            </p>`
          : Object.entries(data.rdes)
              .map(([tooth, rdesObj]) => {
                const risk = calculateToothRdesRisk(rdesObj);
                return `
                  <p class="rdes-tooth-risk ${risk.toLowerCase()}">
                    🦷 Tooth ${tooth} — <strong>${risk.toUpperCase()} RISK</strong>
                  </p>`;
              })
              .join("")
      }
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
