import { board } from "./puzzle.js";
import { createTile } from "./tile.js";
import { selectNumber, selectTile, eraseTile, moveSelection, giveHint, giveSolution} from "./actions.js";
import { undo } from "./history.js";
import { openModal, isModalOpen } from "./modal.js";
import { helpTeasingMessages } from "./messages.js";
import { coconutRain } from "./animations/coconutRain.js";
import { updateNumberPad } from "./numberpad.js";

const arrows = {
    arrowup: [-1, 0],
    arrowdown: [1, 0],
    arrowleft: [0, -1],
    arrowright: [0, 1],
};

export function buildNumberPad() {
    const container = document.getElementById("numbers");
    for (let i = 1; i <= 9; i++) {
        const number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.classList.add("number");
        number.addEventListener("click", () => selectNumber(number));
        container.appendChild(number);
    }
    updateNumberPad();
}

export function buildBoard() {
    const container = document.getElementById("board");
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const tile = createTile(r, c, board[r][c]);
            tile.addEventListener("click", () => selectTile(tile));
            container.append(tile);
        }
    }
    updateNumberPad();
}

export function bindControls() {
    document.getElementById("undo").addEventListener("click", undo);
    document.getElementById("erase").addEventListener("click", eraseTile);
    document.getElementById("help").addEventListener("click", () => {
        openModal(helpTeasingMessages[0], [
            {
                label: "Tak, chlebek nie da rady",
                onClick: () => { giveSolution(); coconutRain(); },
            },
            {
                label: "Nie, walczę dalej i chcę wskazówkę",
                onClick: giveHint,
            },
        ]);
    });

    document.addEventListener("keydown", (e) => {
        if (isModalOpen()) return;

        const key = e.key.toLowerCase();

        if ((e.ctrlKey || e.metaKey) && key === "z") {
            e.preventDefault();
            undo();
            return;
        }
        if (e.ctrlKey || e.metaKey || e.altKey) return;

        if (/^[1-9]$/.test(key)) {
            const btn = document.getElementById(key);
            if (btn.style.visibility !== "hidden") selectNumber(btn);
        } else if (key === "backspace" || key === "delete") {
            eraseTile();
        } else if (arrows[key]) {
            e.preventDefault();
            moveSelection(...arrows[key]);
        }
    });
}