/* =========================
   GLOBAL DATA HANDLING
========================= */

// Get existing data or initialize
function getPatientData() {
  return JSON.parse(localStorage.getItem("patientData")) || {
    oralHealthStatus: null,
    icdas: {},
    periodontal: {}
  };
}

function savePatientData(data) {
  localStorage.setItem("patientData", JSON.stringify(data));
}

/* =========================
   ORAL HEALTH STATUS
========================= */
const oralStatusForm = document.getElementById("oralStatusForm");

if (oralStatusForm) {
  oralStatusForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const selected = document.querySelector(
      'input[name="oralStatus"]:checked'
    );

    if (!selected) return;

    const data = getPatientData();
    data.oralHealthStatus = selected.value;
    savePatientData(data);

    window.location.href = "icdas.html";
  });
}

/* =========================
   ICDAS CHART
========================= */
const icdasForm = document.getElementById("icdasForm");

if (icdasForm) {
  icdasForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = getPatientData();
    const icdasData = {};

    document.querySelectorAll("select[data-tooth]").forEach(select => {
      const tooth = select.dataset.tooth;
      const value = select.value;

      if (value !== "") {
        icdasData[tooth] = Number(value);
      }
    });

    data.icdas = icdasData;
    savePatientData(data);

    window.location.href = "periodontal.html";
  });
}

/* =========================
   PERIODONTAL CHART
========================= */
const periodontalForm = document.getElementById("periodontalForm");

if (periodontalForm) {
  periodontalForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = getPatientData();

    data.periodontal = {
      pocketDepth: document.getElementById("pocketDepth").value,
      bleeding: document.getElementById("bleeding").checked,
      plaque: document.getElementById("plaque").checked
    };

    savePatientData(data);
    window.location.href = "summary.html";
  });
}

/* =========================
   SUMMARY & TX PLAN
========================= */
const summaryContent = document.getElementById("summaryContent");

if (summaryContent) {
  const data = getPatientData();
  const plan = [];

  /* ----- Oral Health Logic ----- */
  if (data.oralHealthStatus === "Poor") {
    plan.push("Oral hygiene instruction required");
  }

  if (data.oralHealthStatus === "Moderate") {
    plan.push("Reinforcement of oral hygiene practices");
  }

  /* ----- ICDAS Logic ----- */
  const icdasValues = Object.values(data.icdas);
  const highCaries = icdasValues.some(v => v >= 4);

  if (highCaries) {
    plan.push("Restorative treatment indicated for carious lesions");
  }

  /* ----- Periodontal Logic ----- */
  if (data.periodontal.bleeding) {
    plan.push("Scaling and polishing recommended");
  }

  if (data.periodontal.pocketDepth === "≥6 mm") {
    plan.push("Periodontal referral advised");
  }

  /* ----- Render Summary ----- */
  summaryContent.innerHTML = `
    <h3>Oral Health Status</h3>
    <p>${data.oralHealthStatus || "Not recorded"}</p>

    <h3>ICDAS Findings</h3>
    <p>${Object.keys(data.icdas).length} teeth recorded</p>

    <h3>Periodontal Status</h3>
    <ul>
      <li>Pocket Depth: ${data.periodontal.pocketDepth || "-"}</li>
      <li>Bleeding on Probing: ${data.periodontal.bleeding ? "Yes" : "No"}</li>
      <li>Plaque Present: ${data.periodontal.plaque ? "Yes" : "No"}</li>
    </ul>

    <h3>Proposed Treatment Plan</h3>
    <ul>
      ${
        plan.length
          ? plan.map(item => `<li>${item}</li>`).join("")
          : "<li>No treatment indicated</li>"
      }
    </ul>
  `;
}
