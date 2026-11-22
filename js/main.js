import { buildBoard, buildNumberPad, bindControls } from "./ui.js";
import { initModal } from "./modal.js";
import { initDifficulty } from "./difficulty.js";

buildNumberPad();
buildBoard();
bindControls();
initModal();
initDifficulty((levelId) => {
  console.log("Difficulty changed to", levelId);
});