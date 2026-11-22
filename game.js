let numSelected = null;
let tileSelected = null;
let errors = 0;

let board = [
  "--74916-5",
  "2---6-3-9",
  "-----7-1-",
  "-586----4",
  "--3----9-",
  "--62--187",
  "9-4-7---2",
  "67-83----",
  "81--45---",
];

let solution = [
  "387491625",
  "241568379",
  "569327418",
  "758619234",
  "123784596",
  "496253187",
  "934176852",
  "675832941",
  "812945763",
];

let notesMode = false;
let history = [];

window.onload = function () {
  initializeGame();
};

function initializeGame() {
  for (let i = 1; i <= 9; i++) {
    let number = document.createElement("div");
    number.id = i;
    number.innerText = i;
    number.addEventListener("click", selectNumber);
    number.classList.add("number");
    document.getElementById("numbers").appendChild(number);
  }

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      let tile = document.createElement("div");
      tile.id = r + "-" + c;
      tile.classList.add("tile");

      let value = document.createElement("span");
      value.classList.add("value");
      tile.append(value);

      let notes = document.createElement("div");
      notes.classList.add("notes");
      for (let n = 1; n <= 9; n++) {
        notes.append(document.createElement("span"));
      }
      tile.append(notes);

      if (board[r][c] != "-") {
        setValue(tile, board[r][c]);
        tile.classList.add("tile-start");
      }
      if (r == 2 || r == 5) tile.classList.add("division-horizontal");
      if (c == 2 || c == 5) tile.classList.add("division-vertical");

      tile.addEventListener("click", selectTile);
      document.getElementById("board").append(tile);
    }
  }

  document.getElementById("undo").addEventListener("click", undo);
  document.getElementById("erase").addEventListener("click", eraseTile);
  document.getElementById("notes").addEventListener("click", toggleNotesMode);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Backspace" || e.key === "Delete") {
      eraseTile();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
      e.preventDefault();
      undo();
    } else if (e.key.toLowerCase() === "n" && !e.ctrlKey && !e.metaKey) {
      toggleNotesMode();
    }
  });
}

function getValue(tile) {
  return tile.querySelector(".value").textContent;
}

function setValue(tile, v) {
  tile.querySelector(".value").textContent = v;
}

function getNotes(tile) {
  return [...tile.querySelectorAll(".notes span")]
    .map((s) => s.textContent)
    .join("");
}

function setNotes(tile, str) {
  tile.querySelectorAll(".notes span").forEach((s, i) => {
    s.textContent = str.includes(String(i + 1)) ? String(i + 1) : "";
  });
}

function toggleNote(tile, n) {
  let current = getNotes(tile);
  setNotes(tile, current.includes(n) ? current.replace(n, "") : current + n);
}

function isLocked(tile) {
  return (
    tile.classList.contains("tile-start") ||
    (getValue(tile) !== "" && !tile.classList.contains("tile-wrong"))
  );
}

function saveHistory(tile) {
  history.push({
    id: tile.id,
    value: getValue(tile),
    wrong: tile.classList.contains("tile-wrong"),
    notes: getNotes(tile),
  });
}

function undo() {
  let state = history.pop();
  if (!state) return;

  let tile = document.getElementById(state.id);
  setValue(tile, state.value);
  setNotes(tile, state.notes);
  tile.classList.toggle("tile-wrong", state.wrong);
  setTileSelected(tile);
}

function selectNumber() {
  if (numSelected != null) {
    numSelected.classList.remove("number-selected");
  }
  numSelected = this;
  numSelected.classList.add("number-selected");
}

function setTileSelected(tile) {
  if (tileSelected) tileSelected.classList.remove("tile-selected");
  tileSelected = tile;
  tile.classList.add("tile-selected");
}

function toggleNotesMode() {
  notesMode = !notesMode;
  document.getElementById("notes").classList.toggle("tool-active", notesMode);
}

function eraseTile() {
  let tile = tileSelected;
  if (!tile || isLocked(tile)) return;
  if (getValue(tile) === "" && getNotes(tile) === "") return;

  saveHistory(tile);
  setValue(tile, "");
  setNotes(tile, "");
  tile.classList.remove("tile-wrong");
}

function selectTile() {
  setTileSelected(this);

  if (!numSelected || isLocked(this)) return;

  if (notesMode) {
    if (getValue(this) !== "") return;
    saveHistory(this);
    toggleNote(this, numSelected.id);
    return;
  }

  if (getValue(this) === numSelected.id) return;

  let [r, c] = this.id.split("-").map(Number);

  saveHistory(this);
  setNotes(this, "");
  setValue(this, numSelected.id);

  if (solution[r][c] === numSelected.id) {
    this.classList.remove("tile-wrong");
  } else {
    errors += 1;
    document.getElementById("errors").innerText = errors;
    this.classList.add("tile-wrong");
  }
}
