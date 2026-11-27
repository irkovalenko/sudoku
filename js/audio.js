const bg = new Audio("media/sounds/background.mp3");
bg.loop = true;
bg.volume = 0.25;

const sfx = {
  mistake: new Audio("media/sounds/mistake_seagull.mp3"),
  score: new Audio("media/sounds/point_coconut.mp3"),
  finish: new Audio("media/sounds/finish_song.mp3")
};
sfx.mistake.volume = 0.5;
sfx.finish.volume = 0.8;

let ctx = null;

let sparkleBuffer = null;
let sparkleLoading = false;

let silent = true;
let activeSfx = 0;

try {
    const saved = localStorage.getItem("silent");
    if (saved !== null) silent = saved === "1";
} catch {}


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
  loadSparkle();
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

async function loadSparkle() {
  if (sparkleLoading) return;
  sparkleLoading = true;
  try {
    const res = await fetch("media/sounds/progress_sparkle.mp3");
    const data = await res.arrayBuffer();
    sparkleBuffer = await getCtx().decodeAudioData(data);
  } catch {
    // no file: the synthesized chime is used instead
  }
}   // <-- loadSparkle ends here

const SPARKLE_NOTES = [1046.5, 1318.5, 1568, 2093, 2637];

function synthSparkle(delay = 0, level = 1) {
  const c = getCtx();
  const base = c.currentTime + delay;
  const count = Math.min(SPARKLE_NOTES.length, level + 2);

  for (let i = 0; i < count; i++) {
    const t = base + i * 0.07;
    const freq = SPARKLE_NOTES[i];

    [[freq, "sine", 0.16], [freq * 2, "triangle", 0.05]].forEach(([f, type, vol]) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = type;
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
      o.connect(g).connect(c.destination);
      o.start(t);
      o.stop(t + 0.45);
    });
  }
}

export function playSparkle(delay = 0, level = 1) {
  if (!sparkleBuffer) return synthSparkle(delay, level);

  const c = getCtx();
  const src = c.createBufferSource();
  src.buffer = sparkleBuffer;
  src.playbackRate.value = 1 + (level - 1) * 0.06;

  const g = c.createGain();
  g.gain.value = 0.5 + level * 0.1;
  src.connect(g).connect(c.destination);
  src.start(c.currentTime + delay);
}