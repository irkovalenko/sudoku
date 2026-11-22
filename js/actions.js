import { state } from "./state.js";
import { solution } from "./puzzle.js";
import {
  getValue, setValue, getNotes, setNotes, toggleNote, isLocked, setTileSelected,
} from "./tile.js";
import { saveHistory } from "./history.js";

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