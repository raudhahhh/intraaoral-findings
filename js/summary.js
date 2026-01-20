function getPatientData() {
  return JSON.parse(localStorage.getItem("patientData")) || {};
}

const summaryContent = document.getElementById("summaryContent");

const oralHealthDescriptions = {
  Good: "Maintain oral hygiene",
  Moderate: "Reinforcement of oral hygiene instruction",
  Poor: "Reinforcement of oral hygiene instruction"
};

const icdasTreatmentMap = {
  1: "First visual change in enamel — Fissure sealant",
  2: "Distinct visual change in enamel — Fissure sealant",
  3: "Localized enamel breakdown — Restoration",
  4: "Underlying dark shadow — Restoration",
  5: "Distinct cavity — IOPa, Vitality Test, Restoration, RCT, Crown & Bridge",
  6: "Extensive cavity — IOPa, Vitality Test, Restoration, RCT, Crown & Bridge"
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
  const plan = [];

  /* ===== ORAL HYGIENE ===== */
  if (data.oralHealthStatus) {
    plan.push(
      `👄 ORAL HYGIENE 👄 — ${data.oralHealthStatus} — ${oralHealthDescriptions[data.oralHealthStatus]}`
    );
  }

  /* ===== ICDAS ===== */
  Object.entries(data.icdas || {}).forEach(([tooth, code]) => {
    plan.push(`🦷 Tooth ${tooth}: ICDAS ${code} — ${icdasTreatmentMap[code]}`);
  });

  /* ===== BPE ===== */
  const bpeData = JSON.parse(localStorage.getItem("bpeData")) || {};
  const bpeCodes = Object.values(bpeData);

  if (bpeCodes.length > 0) {
    plan.push("🪥 BASIC PERIODONTAL EXAMINATION 🪥");

    const uniqueCodes = [...new Set(bpeCodes)];

    uniqueCodes.forEach(code => {
      if (bpeTreatmentMap[code]) {
        plan.push(`${code} — ${bpeTreatmentMap[code]}`);
      }
    });
  }

  /* ===== RENDER ===== */
  summaryContent.innerHTML = `
    <ul>
      ${plan.map(p => `<li>${p}</li>`).join("")}
    </ul>
  `;
}

/* =========================
   RESET ON NEW ASSESSMENT
========================= */

const resetBtn = document.getElementById("resetBtn");

if (resetBtn) {
  resetBtn.addEventListener("click", (e) => {
    e.preventDefault(); // stop instant navigation

    localStorage.removeItem("patientData");
    localStorage.removeItem("bpeData");

    window.location.href = "index.html"; // navigate AFTER reset
  });
}

