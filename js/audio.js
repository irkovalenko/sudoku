const bg = new Audio("media/sounds/background.mp3");
bg.loop = true;
bg.volume = 0.25;

let ctx = null;
let impactBuffer = null;
let impactLoading = false;

const sfx = {
  mistake: new Audio("media/sounds/mistake_seagull.mp3"),
  score: new Audio("media/sounds/point_coconut.mp3"),
};
sfx.mistake.volume = 0.5;

let silent = false;
try { silent = localStorage.getItem("silent") === "1"; } catch {}

let activeSfx = 0;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function syncBg() {
  if (silent || activeSfx > 0) bg.pause();
  else bg.play().catch(() => {});
}

export function playSfx(name) {
  const a = sfx[name];
  if (!a) return;

  a.currentTime = 0;
  activeSfx++;
  syncBg();

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    activeSfx = Math.max(0, activeSfx - 1);
    syncBg();
  };

  a.addEventListener("ended", finish, { once: true });
  a.play().catch(finish);
}

export function startMusic() {
  syncBg();
  getCtx();
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

const THUD = {
  pitch: 200,
  drop: 80,
  length: 0.12,
  crack: 0.9,
  crackTone: 2500, 
  volume: 0.4,
};

function synthThud(c, out, t, vol) {
  const o = c.createOscillator();
  const og = c.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(THUD.pitch * (0.85 + Math.random() * 0.6), t);
  o.frequency.exponentialRampToValueAtTime(THUD.drop, t + THUD.length * 0.8);
  og.gain.setValueAtTime(vol, t);
  og.gain.exponentialRampToValueAtTime(0.001, t + THUD.length);
  o.connect(og).connect(out);
  o.start(t);
  o.stop(t + THUD.length + 0.03);

  const len = Math.floor(c.sampleRate * 0.08);
  const nb = c.createBuffer(1, len, c.sampleRate);
  const d = nb.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const n = c.createBufferSource();
  n.buffer = nb;
  const f = c.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.value = THUD.crackTone;
  const ng = c.createGain();
  ng.gain.value = vol * THUD.crack;
  n.connect(f).connect(ng).connect(out);
  n.start(t);
}

export function playImpact(delay = 0) {
  const c = getCtx();
  const t = c.currentTime + delay;
  const vol = THUD.volume * (0.75 + Math.random() * 0.5);

  const out = c.createGain();
  out.connect(c.destination);
  synthThud(c, out, t, vol);
}