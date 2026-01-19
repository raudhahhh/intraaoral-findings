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

const icdasColors = {
  0: "#ffffff",
  1: "#b6e3ff",
  2: "#b6e3ff",
  3: "#ffd966",
  4: "#ffb347",
  5: "#ff6b6b",
  6: "#8b0000"
};

const teeth = document.querySelectorAll(".tooth");
const saveIcdasBtn = document.getElementById("saveIcdas");

if (teeth.length > 0) {
  const data = getPatientData();

  teeth.forEach(tooth => {
    const toothNo = tooth.dataset.tooth;
    const savedValue = data.icdas?.[toothNo] ?? 0;

    tooth.dataset.icdas = savedValue;
    tooth.style.backgroundColor = icdasColors[savedValue];

    tooth.addEventListener("click", () => {
      let current = Number(tooth.dataset.icdas);
      let next = (current + 1) % 7;

      tooth.dataset.icdas = next;
      tooth.style.backgroundColor = icdasColors[next];
    });
  });
}

if (saveIcdasBtn) {
  saveIcdasBtn.addEventListener("click", () => {
    const data = getPatientData();
    data.icdas = {};

    teeth.forEach(tooth => {
      const value = Number(tooth.dataset.icdas);
      if (value > 0) {
        data.icdas[tooth.dataset.tooth] = value;
      }
    });

    savePatientData(data);
    window.location.href = "periodontal.html";
  });
}
