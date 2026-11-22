import { state } from "./state.js";

export const difficultyLevels = [
  { id: "easy", label: "🟢 Easy-peasy" },
  { id: "medium", label: "🟡 Medium" },
  { id: "hard", label: "🔴 Hard" },
];

export function initDifficulty(onChange) {
  const toggle = document.getElementById("difficulty");
  const menu = document.getElementById("difficulty-menu");

  function renderToggle() {
    const current = difficultyLevels.find((l) => l.id === state.difficulty);
    toggle.textContent = current.label + " ▾";
  }

  function open() {
    menu.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
  }

  function close() {
    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  }

  for (const level of difficultyLevels) {
    const item = document.createElement("li");
    item.textContent = level.label;
    item.setAttribute("role", "option");
    item.addEventListener("click", () => {
      close();
      if (level.id === state.difficulty) return;
      state.difficulty = level.id;
      renderToggle();
      onChange(level.id);
    });
    menu.append(item);
  }

  toggle.addEventListener("click", () => (menu.hidden ? open() : close()));

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  renderToggle();
}
