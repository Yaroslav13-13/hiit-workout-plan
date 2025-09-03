// =====================
// Tabs
// =====================

document.querySelectorAll(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".tab")
      .forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tabpane").forEach((p) => (p.hidden = true));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).hidden = false;
  });
});
