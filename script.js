// =====================
// Tabs
// =====================

document.querySelectorAll(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    // 1) Відмічаємо активну кнопку
    document
      .querySelectorAll(".tab")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // 2) Ховаємо всі панелі та показуємо ту, яка потрібна
    document.querySelectorAll(".tabpane").forEach((p) => (p.hidden = true));
    const id = btn.dataset.tab;
    const panel = document.getElementById(id);
    if (panel) panel.hidden = false;
    else console.warn("No panel with id:", id);
  });
});
