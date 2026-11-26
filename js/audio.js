const bg = new Audio("media/sounds/background.mp3");
bg.loop = true;
bg.volume = 0.25;

const sfx = {
  mistake: new Audio("media/sounds/mistake_seagull.mp3"),
  score: new Audio("media/sounds/point_coconut.mp3"),
};
sfx.mistake.volume = 0.5;

let silent = false;
try { silent = localStorage.getItem("silent") === "1"; } catch {}

let started = false;
let activeSfx = 0;

function syncBg() {
  if (!started || silent || activeSfx > 0) bg.pause();
  else bg.play().catch(() => {});
}

// Browsers block audio until the first click or key press
export function startMusic() {
  started = true;
  syncBg();
}

export function playSfx(name) {
  const a = sfx[name];
  if (!a) return;

  a.currentTime = 0;
  activeSfx++;
  syncBg(); // pauses the music

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    activeSfx = Math.max(0, activeSfx - 1);
    syncBg(); // resumes the music
  };
  a.addEventListener("ended", finish, { once: true });
  a.play().catch(finish);
}

export function isSilent() {
  return silent;
}

export function toggleSilent() {
  silent = !silent;
  try { localStorage.setItem("silent", silent ? "1" : "0"); } catch {}
  syncBg();
  return silent;
}