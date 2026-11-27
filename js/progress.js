import { solution } from "./puzzle.js";
import { getValue } from "./tile.js";
import { milestoneBurst } from "./animations/milestone.js";
import { ratParade } from "./animations/ratParade.js";
import { playSparkle, playSfx } from "./audio.js";

const MILESTONES = [
  { at: 25, emoji: "🐚", level: 1, caption: "Nice!" },
  { at: 50, emoji: "🐟", level: 2, caption: "Ryba w wodzie!" },
  { at: 75, emoji: "🦈", level: 3, caption: "Killin' it!" },
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
  if (fill) fill.style.width = `${pct}%`;

  for (const m of MILESTONES) {
    if (pct < m.at || reached.has(m.at)) continue;
    reached.add(m.at);
    document.querySelector(`.node[data-at="${m.at}"]`)?.classList.add("reached");
    if (!celebrate) continue;

    if (m.emoji) {
      milestoneBurst(m.emoji, m.caption, m.level);
    } else {
      playSparkle(0, 3);
      playSfx("finish");
      ratParade();
    }
  }
}