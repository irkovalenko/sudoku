import { playSparkle } from "../audio.js";

export function milestoneBurst(emoji, caption = "", level = 1) {
  const size = Math.min(window.innerWidth * 0.3, 160);

  const wrap = document.createElement("div");
  Object.assign(wrap.style, {
    position: "fixed",
    inset: "0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: "20vh",
    pointerEvents: "none",
    zIndex: "9999",
  });

  const stage = document.createElement("div");
  Object.assign(stage.style, {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  });

  const main = document.createElement("span");
  main.textContent = emoji;
  Object.assign(main.style, { fontSize: `${size}px`, lineHeight: "1" });
  stage.append(main);

  if (caption) {
    const label = document.createElement("span");
    label.textContent = caption;
    Object.assign(label.style, {
      marginTop: "8px",
      fontSize: `${Math.max(18, size * 0.22)}px`,
      fontWeight: "bold",
      whiteSpace: "nowrap",
      color: "#090909",
      textShadow: "0 2px 6px rgba(0, 40, 90, 0.7)",
    });
    stage.append(label);
    label.animate(
      [{ opacity: 0 }, { opacity: 0, offset: 0.3 }, { opacity: 1, offset: 0.45 },
      { opacity: 1, offset: 0.8 }, { opacity: 0 }],
      { duration: 2200, fill: "both" }
    );
  }

  const sparkles = 10;
  for (let i = 0; i < sparkles; i++) {
    const s = document.createElement("span");
    s.textContent = "✨";
    Object.assign(s.style, {
      position: "absolute",
      left: "50%",
      top: `${size / 2}px`,
      fontSize: `${size * 0.22}px`,
      lineHeight: "1",
    });
    stage.append(s);

    const angle = (i / sparkles) * Math.PI * 2;
    const dist = size * (0.75 + Math.random() * 0.35);
    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist;
    s.animate(
      [
        { transform: "translate(-50%, -50%) scale(0)", opacity: 0 },
        { transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(1)`, opacity: 1, offset: 0.5 },
        { transform: `translate(-50%, -50%) translate(${x * 1.2}px, ${y * 1.2}px) scale(0)`, opacity: 0 },
      ],
      { duration: 900, delay: 700, easing: "ease-out", fill: "both" }
    );
  }

  wrap.append(stage);
  document.body.appendChild(wrap);
  playSparkle(0.7, level);

  const anim = main.animate(
    [
      { transform: "scale(0)", opacity: 0 },
      { transform: "scale(1.2)", opacity: 1, offset: 0.3 },
      { transform: "scale(1)", opacity: 1, offset: 0.4 },
      { transform: "scale(1)", opacity: 1, offset: 0.8 },
      { transform: "scale(1.1)", opacity: 0 },
    ],
    { duration: 2200, fill: "both" }
  );
  anim.onfinish = () => wrap.remove();
}