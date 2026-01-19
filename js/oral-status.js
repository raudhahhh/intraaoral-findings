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
