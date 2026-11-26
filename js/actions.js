import { state } from "./state.js";
import { solution } from "./puzzle.js";
import { flyCoconut } from "./animations/flyCoconut.js";
import {
  getValue, setValue,isLocked, setTileSelected,
} from "./tile.js";
import { saveHistory } from "./history.js";
import { updateNumberPad } from "./numberpad.js";
import { playSfx } from "./audio.js";

const musicMistake = new Audio('media/sounds/mistake_seagull.mp3');
const musicScore = new Audio('media/sounds/point_coconut.mp3');
musicMistake.loop = false;
musicMistake.volume = 0.5;

musicScore.loop = false;
musicScore.volume = 0.5;

function animateScore(el, from, to, duration = 400) {
  if (el._rafId) cancelAnimationFrame(el._rafId);

  el.classList.remove("score-pop");
  void el.offsetWidth;
  el.classList.add("score-pop");

  const start = performance.now();
  const step = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.innerText = Math.round(from + (to - from) * eased);
    if (t < 1) {
      el._rafId = requestAnimationFrame(step);
    } else {
      el.innerText = to;
      el._rafId = null;
    }
  };
  el._rafId = requestAnimationFrame(step);
}

export function placeNumber(tile, num) {
  if (isLocked(tile)) return;

  if (state.notesMode) {
    if (getValue(tile) !== "") return;
    saveHistory(tile);
    toggleNote(tile, num);
    return;
  }

  if (getValue(tile) === num) return;

  const [r, c] = tile.id.split("-").map(Number);

  saveHistory(tile);
  setValue(tile, num);

  if (solution[r][c] === num) {
    tile.classList.remove("tile-wrong");
    const scoreEl = document.getElementById("score");
    state.scores += 1;
    const target = state.scores;

  flyCoconut(scoreEl, () => {
  animateScore(scoreEl, target - 1, target);
  playSfx("score");
});
    musicScore.play();
  } else {
    state.errors += 1;
    document.getElementById("errors").innerText = state.errors;
    tile.classList.add("tile-wrong");
    playSfx("mistake");
  }
  updateNumberPad();
}

export function selectNumber(numberEl) {
  if (state.numSelected) state.numSelected.classList.remove("number-selected");
  state.numSelected = numberEl;
  numberEl.classList.add("number-selected");

  if (state.tileSelected) placeNumber(state.tileSelected, numberEl.id);
}

export function selectTile(tile) {
  setTileSelected(tile);
  if (state.numSelected) placeNumber(tile, state.numSelected.id);
}

export function moveSelection(dr, dc) {
  const current = state.tileSelected;
  const clamp = (n) => Math.max(0, Math.min(8, n));
  let r = 0, c = 0;

  if (current) {
    const [cr, cc] = current.id.split("-").map(Number);
    r = clamp(cr + dr);
    c = clamp(cc + dc);
  }
  setTileSelected(document.getElementById(`${r}-${c}`));
}

export function eraseTile() {
  const tile = state.tileSelected;
  if (!tile || isLocked(tile)) return;
  if (getValue(tile) === "" && getNotes(tile) === "") return;

  saveHistory(tile);
  setValue(tile, "");
  tile.classList.remove("tile-wrong");
  updateNumberPad();
}

export function giveHint() {
  const candidates = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const tile = document.getElementById(`${r}-${c}`);
      if (getValue(tile) !== String(solution[r][c])) candidates.push([r, c, tile]);
    }
  }
  if (candidates.length === 0) return;

  const [r, c, tile] = candidates[Math.floor(Math.random() * candidates.length)];
  saveHistory(tile);
  setValue(tile, solution[r][c]);
  tile.classList.remove("tile-wrong");
  setTileSelected(tile);
  updateNumberPad();
}

export function giveSolution() {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const tile = document.getElementById(`${r}-${c}`);
      if (isLocked(tile)) continue;

      setValue(tile, solution[r][c]);
      tile.classList.remove("tile-wrong");
    }
  }
  updateNumberPad({ celebrate: false });
}