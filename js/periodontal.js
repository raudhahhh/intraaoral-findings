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

const periodontalForm = document.getElementById("periodontalForm");

if (periodontalForm) {
  periodontalForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = getPatientData();

   localStorage.setItem("bpeData", JSON.stringify(bpeData))

    savePatientData(data);
    window.location.href = "summary.html";
  });
}
