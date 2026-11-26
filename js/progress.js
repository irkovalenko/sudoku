import { solution } from "./puzzle.js";
import { getValue } from "./tile.js";
import { milestoneBurst } from "./animations/milestone.js";
import { ratParade } from "./animations/ratParade.js";

const MILESTONES = [
  { at: 25, emoji: "🐚" },
  { at: 50, emoji: "🐟" },
  { at: 75, emoji: "🦈", caption: "killin' it" },
  { at: 100 },
];
const reached = new Set();

function measure() {
  let total = 0, correct = 0;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const tile = document.getElementById(`${r}-${c}`);
      if (!tile || tile.classList.contains("tile-start")) continue;
      total++;
      if (getValue(tile) === String(solution[r][c])) correct++;
    }
  }
  return total ? (correct / total) * 100 : 0;
}

export function updateProgress({ celebrate = true } = {}) {
  const pct = measure();

  const fill = document.getElementById("progress-fill");
  if (fill) fill.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;

  for (const m of MILESTONES) {
    if (pct < m.at || reached.has(m.at)) continue;
    reached.add(m.at);
    document.querySelector(`.milestone[data-at="${m.at}"]`)?.classList.add("reached");
    if (!celebrate) continue;
    if (m.emoji) milestoneBurst(m.emoji, m.caption);
    else ratParade();
  }
}