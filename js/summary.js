function getPatientData() {
  return JSON.parse(localStorage.getItem("patientData")) || {};
}

const summaryContent = document.getElementById("summaryContent");

const oralHealthDescriptions = {
  Good: "Maintain oral hygiene",
  Moderate: "Reinforcement of oral hygiene instruction",
  Poor: "Reinforcement of oral hygiene instruction"
};

const bpeTreatmentMap = {
  "0": "Healthy gingival tissues, no BOP — No treatment",
  "1": "No calculus or defective margins, BOP present — Oral hygiene instruction (OHI)",
  "2": "Colored area fully visible — Scaling and polishing",
  "3": "Colored area partly visible — Scaling and polishing, Root surface debridement (RSD)",
  "4": "Colored area disappears (≥6 mm) — Scaling and polishing, Root surface debridement (RSD)",
  "*": "Furcation involvement present"
};

if (summaryContent) {
  const data = getPatientData();

  /* ===== ICDAS ===== */
  const icdasEntries = Object.entries(data.icdas || {});

  /* ===== BPE ===== */
  const bpeData = JSON.parse(localStorage.getItem("bpeData")) || {};
  const bpeCodes = Object.values(bpeData);

  let maxCode = null;
  if (bpeCodes.length > 0) {
    const severityOrder = ["0", "1", "2", "3", "4", "*"];
    maxCode = bpeCodes.reduce((worst, current) =>
      severityOrder.indexOf(current) > severityOrder.indexOf(worst)
        ? current
        : worst
    , "0");
  }

  /* ===== RENDER ===== */
  summaryContent.innerHTML = `
    <div class="report-section">
      <h3>👄 ORAL HYGIENE</h3>
      <p>${
        data.oralHealthStatus
          ? `${data.oralHealthStatus} — ${oralHealthDescriptions[data.oralHealthStatus]}`
          : "Not recorded"
      }</p>
    </div>

    <div class="report-section">
      <h3>🦷 ICDAS CHART</h3>
      ${
        icdasEntries.length
          ? icdasEntries
              .map(([tooth, code]) => `<p>🦷 Tooth ${tooth}: ICDAS ${code}</p>`)
              .join("")
          : "<p>No ICDAS findings recorded</p>"
      }
    </div>

    <div class="report-section">
      <h3>🪥 BASIC PERIODONTAL EXAMINATION</h3>
      ${
        maxCode
          ? `<p><strong>Code ${maxCode}</strong> — ${bpeTreatmentMap[maxCode]}</p>`
          : "<p>No BPE recorded</p>"
      }
    </div>
  `;
}

/* ===== RESET ===== */
const resetBtn = document.getElementById("resetBtn");

if (resetBtn) {
  resetBtn.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("patientData");
    localStorage.removeItem("bpeData");
    window.location.href = "index.html";
  });
}
