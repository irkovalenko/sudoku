import { state } from "./state.js";

export function createTile(r, c, given) {
    const tile = document.createElement("div");
    tile.id = `${r}-${c}`;
    tile.classList.add("tile");

    const value = document.createElement("span");
    value.classList.add("value");
    tile.append(value);

    const notes = document.createElement("div");
    notes.classList.add("notes");
    for (let n = 1; n <= 9; n++) notes.append(document.createElement("span"));
    tile.append(notes);

    if (given !== "-") {
        setValue(tile, given);
        tile.classList.add("tile-start");
    }
    if (r === 2 || r === 5) tile.classList.add("division-horizontal");
    if (c === 2 || c === 5) tile.classList.add("division-vertical");

    return tile;
}

export function getValue(tile) {
    return tile.querySelector(".value").textContent;
}

export function setValue(tile, v) {
    tile.querySelector(".value").textContent = v;
}

export function getNotes(tile) {
    return [...tile.querySelectorAll(".notes span")]
        .map((s) => s.textContent)
        .join("");
}

export function setNotes(tile, str) {
    tile.querySelectorAll(".notes span").forEach((s, i) => {
        s.textContent = str.includes(String(i + 1)) ? String(i + 1) : "";
    });
}

export function toggleNote(tile, n) {
    const current = getNotes(tile);
    setNotes(tile, current.includes(n) ? current.replace(n, "") : current + n);
}

export function isLocked(tile) {
    return (
        tile.classList.contains("tile-start") ||
        (getValue(tile) !== "" && !tile.classList.contains("tile-wrong"))
    );
}

export function setTileSelected(tile) {
    if (state.tileSelected) state.tileSelected.classList.remove("tile-selected");
    state.tileSelected = tile;
    tile.classList.add("tile-selected");
}