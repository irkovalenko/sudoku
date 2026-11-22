import { state } from "./state.js";
import { solution } from "./puzzle.js";
import {
  getValue, setValue, getNotes, setNotes, toggleNote, isLocked, setTileSelected,
} from "./tile.js";
import { saveHistory } from "./history.js";

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

function flyCoconut(targetEl, onLand, duration = 750) {
  const size = 32;
  const coconut = document.createElement("span");
  coconut.textContent = "🥥";
  Object.assign(coconut.style, {
    position: "fixed",
    left: "0",
    top: "0",
    fontSize: `${size}px`,
    lineHeight: "1",
    pointerEvents: "none",
    zIndex: "9999",
    willChange: "transform",
  });
  document.body.appendChild(coconut);

  const rect = targetEl.getBoundingClientRect();
  const endX = rect.left + rect.width / 2 - size / 2;
  const endY = rect.top + rect.height / 2 - size / 2;

  const startX = window.innerWidth / 2 - size / 2 + (Math.random() - 0.5) * 160;
  const startY = window.innerHeight + 10;


  const midX = (startX + endX) / 2 + (Math.random() - 0.5) * 140;
  const midY = endY + (startY - endY) * 0.4;

  const anim = coconut.animate(
    [
      { transform: `translate(${startX}px, ${startY}px) rotate(0deg) scale(1)` },
      { transform: `translate(${midX}px, ${midY}px) rotate(360deg) scale(1.25)`, offset: 0.5 },
      { transform: `translate(${endX}px, ${endY}px) rotate(720deg) scale(0.6)` },
    ],
    { duration, easing: "cubic-bezier(0.3, 0.1, 0.3, 1)", fill: "forwards" }
  );

  anim.onfinish = () => {
    coconut.remove();
    onLand();
  };
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
  setNotes(tile, "");
  setValue(tile, num);

  if (solution[r][c] === num) {
    tile.classList.remove("tile-wrong");
    const scoreEl = document.getElementById("score");
    state.scores += 1;
    const target = state.scores;

    flyCoconut(scoreEl, () => animateScore(scoreEl, target - 1, target));
  } else {
    state.errors += 1;
    document.getElementById("errors").innerText = state.errors;
    tile.classList.add("tile-wrong");
  }
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

export function toggleNotesMode() {
  state.notesMode = !state.notesMode;
  document.getElementById("notes").classList.toggle("tool-active", state.notesMode);
}

export function eraseTile() {
  const tile = state.tileSelected;
  if (!tile || isLocked(tile)) return;
  if (getValue(tile) === "" && getNotes(tile) === "") return;

  saveHistory(tile);
  setValue(tile, "");
  setNotes(tile, "");
  tile.classList.remove("tile-wrong");
}

export function giveSolution() {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const tile = document.getElementById(`${r}-${c}`);
      if (isLocked(tile)) continue;

      setNotes(tile, "");
      setValue(tile, solution[r][c]);
      tile.classList.remove("tile-wrong");
    }
  }
}