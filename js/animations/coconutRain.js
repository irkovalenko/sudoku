import { playImpact } from "../audio.js";
import { impactBurst } from "./impactBurst.js";

const DURATION = 1100;
const HIT = DURATION * 0.8;

export function coconutRain(count = 25) {
  const size = Math.min(40, window.innerWidth * 0.09);
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.textContent = "🥥";
    Object.assign(el.style, {
      position: "fixed",
      left: `${5 + Math.random() * 90}vw`,
      top: `${10 + Math.random() * 70}vh`,
      fontSize: `${size}px`,
      lineHeight: "1",
      pointerEvents: "none",
      zIndex: "9999",
    });
    document.body.appendChild(el);

    const spin = (Math.random() - 0.5) * 360;
    const anim = el.animate(
      [
        { transform: "scale(0.1) rotate(0deg)", opacity: 0 },
        { transform: `scale(1) rotate(${spin / 3}deg)`, opacity: 1, offset: 0.25 },
        { transform: `scale(7) rotate(${spin}deg)`, opacity: 1, offset: 0.9 },
        { transform: `scale(9) rotate(${spin}deg)`, opacity: 0 },
      ],
      { duration: DURATION, delay: i * 90, easing: "ease-in", fill: "both" }
    );
    playImpact((i * 90 + HIT) / 1000);
    if (i % 5 === 2) impactBurst(i * 90 + HIT);
    anim.onfinish = () => el.remove();
  }
}