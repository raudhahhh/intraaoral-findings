const startBtn = document.getElementById("startAssessmentBtn");

if (startBtn) {
  startBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // CLEAR EVERYTHING
    localStorage.removeItem("patientData");
    localStorage.removeItem("bpeData");

    // START FRESH
    window.location.href = "oral-status.html";
  });
}
