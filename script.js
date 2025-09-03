// Tabs
document.querySelectorAll(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".tab")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".tabpane").forEach((p) => (p.hidden = true));
    const panel = document.getElementById(btn.dataset.tab);
    if (panel) panel.hidden = false;
  });
});

// Theme Toggle
const themeBtn = document.getElementById("theme-toggle");
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("day");
  themeBtn.textContent = document.body.classList.contains("day") ? "🌙" : "☀️";
});
