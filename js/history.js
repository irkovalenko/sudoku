import { state } from "./state.js";
import {
  getValue, setValue, getNotes, setNotes, setTileSelected,
} from "./tile.js";
import { updateNumberPad } from "./numberpad.js";

export function saveHistory(tile) {
  state.history.push({
    id: tile.id,
    value: getValue(tile),
    wrong: tile.classList.contains("tile-wrong"),
    notes: getNotes(tile),
  });
}

export function undo() {
  const snapshot = state.history.pop();
  if (!snapshot) return;

  const tile = document.getElementById(snapshot.id);
  setValue(tile, snapshot.value);
  setNotes(tile, snapshot.notes);
  tile.classList.toggle("tile-wrong", snapshot.wrong);
  setTileSelected(tile);
  updateNumberPad();
}