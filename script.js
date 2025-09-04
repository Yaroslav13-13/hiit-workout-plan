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

// =====================
// Elements
// =====================
const timeEl = document.getElementById("time");
const phaseEl = document.getElementById("phase");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const subtitleEl = document.getElementById("subtitle");
const workIn = document.getElementById("work");
const restIn = document.getElementById("rest");
const roundsIn = document.getElementById("rounds");

// =====================
// Timer State
// =====================
const timerState = {
  round: 1,
  isWork: true,
  remaining: +workIn.value || 40,
  timer: null,
};

// =====================
// Utilities
// =====================
function fmt(s) {
  s = Math.max(0, Math.floor(s));
  const m = String(Math.floor(s / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${m}:${sec}`;
}

// =====================
// Audio Beep
// =====================
let audioCtx;
function beep(freq = 880, dur = 120) {
  try {
    const ctx =
      audioCtx ||
      (audioCtx = new (window.AudioContext || window.webkitAudioContext)());
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.value = freq;
    o.type = "sine";
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    o.start();
    setTimeout(() => {
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);
      o.stop();
    }, dur);
  } catch {}
}

// =====================
// Update Screen
// =====================
function updateScreen() {
  const phase = timerState.isWork ? "Work" : "Rest";
  timeEl.textContent = fmt(timerState.remaining);
  phaseEl.textContent = `Round ${
    timerState.round
  }/${+roundsIn.value} — ${phase}`;
  document.title = `${fmt(timerState.remaining)} • ${phase} • HIIT`;
}

// =====================
// Next Phase
// =====================
function nextPhase() {
  const work = +workIn.value || 40;
  const rest = +restIn.value || 20;
  const totalRounds = +roundsIn.value || 10;

  if (timerState.isWork && rest > 0) {
    timerState.isWork = false;
    timerState.remaining = rest;
    beep(660);
  } else {
    timerState.round++;
    if (timerState.round > totalRounds) {
      stopTimer();
      return;
    }
    timerState.isWork = true;
    timerState.remaining = work;
    beep(990);
  }
}

// =====================
// Tick
// =====================
function tick() {
  if (--timerState.remaining <= 0) nextPhase();
  updateScreen();
}

// =====================
// Timer Controls
// =====================
function startTimer() {
  if (timerState.timer) return;
  timerState.remaining = timerState.isWork
    ? +workIn.value || 40
    : +restIn.value || 20;
  updateScreen();
  timerState.timer = setInterval(tick, 1000);
  beep(990);
}

function pauseTimer() {
  if (timerState.timer) {
    clearInterval(timerState.timer);
    timerState.timer = null;
    beep(440);
  }
}

function stopTimer() {
  clearInterval(timerState.timer);
  timerState.timer = null;
  beep(440);
  timerState.round = 1;
  timerState.isWork = true;
  timerState.remaining = +workIn.value || 40;
  updateScreen();
}

// =====================
// Event Listeners
// =====================
[startBtn, pauseBtn, resetBtn].forEach((btn, i) =>
  btn.addEventListener("click", [startTimer, pauseTimer, stopTimer][i])
);

// =====================
// Update Subtitle
// =====================
function updateSubtitle() {
  const work = +workIn.value || 60;
  const rest = +restIn.value || 20;
  const rounds = +roundsIn.value || 10;

  // підрахунок часу (в хвилинах)
  const totalSeconds = (work + rest) * rounds;
  const totalMin = Math.ceil(totalSeconds / 60);

  subtitleEl.innerHTML = `One round: <b>${work}s work |</b> <b>${rest}s rest |</b> <b>${rounds} rounds</b> &nbsp; (${totalMin} min)`;
}

// =====================
// Слухачі на інпутах
// =====================
[workIn, restIn, roundsIn].forEach((input) =>
  input.addEventListener("input", updateSubtitle)
);

// =====================
// Initialize Screen
// =====================
updateScreen();
updateSubtitle();
