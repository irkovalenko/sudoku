const WORDS = ["AUCH!", "BAM!", "TOK!", "ŁUP!"];

function starPoints(spikes = 12, outer = 48, inner = 28) {
  const pts = [];
  for (let i = 0; i < spikes * 2; i++) {
    const r = (i % 2 ? inner : outer) * (0.85 + Math.random() * 0.3);
    const a = (i / (spikes * 2)) * Math.PI * 2;
    pts.push(`${(50 + Math.cos(a) * r).toFixed(1)},${(50 + Math.sin(a) * r).toFixed(1)}`);
  }
  return pts.join(" ");
}

export function impactBurst(delayMs = 0, word = WORDS[Math.floor(Math.random() * WORDS.length)]) {
  const size = Math.min(window.innerWidth * 0.32, 170);
  const ns = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  Object.assign(svg.style, {
    position: "fixed",
    left: `${10 + Math.random() * 60}vw`,
    top: `${15 + Math.random() * 50}vh`,
    width: `${size}px`,
    height: `${size}px`,
    overflow: "visible",
    pointerEvents: "none",
    zIndex: "10000",
  });

  const star = document.createElementNS(ns, "polygon");
  star.setAttribute("points", starPoints());
  star.setAttribute("fill", "#2f9be8");
  star.setAttribute("stroke", "#0b3d7a");
  star.setAttribute("stroke-width", "3");
  star.setAttribute("stroke-linejoin", "round");

  const text = document.createElementNS(ns, "text");
  text.textContent = word;
  text.setAttribute("x", "50");
  text.setAttribute("y", "50");
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("dominant-baseline", "central");
  text.setAttribute("font-size", word.length > 4 ? "22" : "28");
  text.setAttribute("fill", "#fff");
  text.setAttribute("stroke", "#0b3d7a");
  text.setAttribute("stroke-width", "4");
  text.setAttribute("paint-order", "stroke");
  text.setAttribute("stroke-linejoin", "round");
  text.style.fontFamily = 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif';

  svg.append(star, text);
  document.body.appendChild(svg);

  const tilt = (Math.random() - 0.5) * 30;
  const anim = svg.animate(
    [
      { transform: `scale(0) rotate(${tilt - 20}deg)`, opacity: 0 },
      { transform: `scale(1.2) rotate(${tilt}deg)`, opacity: 1, offset: 0.25 },
      { transform: `scale(1) rotate(${tilt}deg)`, opacity: 1, offset: 0.45 },
      { transform: `scale(1) rotate(${tilt}deg)`, opacity: 1, offset: 0.75 },
      { transform: `scale(0.9) rotate(${tilt}deg)`, opacity: 0 },
    ],
    { duration: 800, delay: delayMs, fill: "both" }
  );
  anim.onfinish = () => svg.remove();
}