import { state } from "./state.js";
import { solution } from "./puzzle.js";
import { getValue } from "./tile.js";
import { updateProgress } from "./progress.js";

export function updateNumberPad(opts) {
    const counts = Array(10).fill(0);

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const tile = document.getElementById(`${r}-${c}`);
            if (!tile) return;   // board not built yet
            const v = getValue(tile);
            if (v !== "" && v === String(solution[r][c])) counts[Number(v)]++;
        }
    }

    for (let n = 1; n <= 9; n++) {
        const btn = document.getElementById(String(n));
        if (!btn) continue;
        const done = counts[n] >= 9;
        btn.style.visibility = done ? "hidden" : "visible";

        if (done && state.numSelected === btn) {
            btn.classList.remove("number-selected");
            state.numSelected = null;
        }
    }

    updateProgress(opts);
}