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

if (summaryContent) {
  const data = getPatientData();
  const plan = [];

  if (data.oralHealthStatus) {
    plan.push(
      `${data.oralHealthStatus} — ${oralHealthDescriptions[data.oralHealthStatus]}`
    );
  }

  Object.entries(data.icdas || {}).forEach(([tooth, code]) => {
    plan.push(`Tooth ${tooth}: ICDAS ${code} — ${icdasTreatmentMap[code]}`);
  });

  summaryContent.innerHTML = `<ul>${plan.map(p => `<li>${p}</li>`).join("")}</ul>`;
}
