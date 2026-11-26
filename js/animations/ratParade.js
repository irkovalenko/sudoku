export function ratParade() {
  const size = Math.max(32, Math.min(64, window.innerWidth * 0.12));
  const duration = Math.max(4500, window.innerWidth * 5);

  const wrap = document.createElement("div");
  Object.assign(wrap.style, {
    position: "fixed",
    left: "0",
    top: "40%",
    display: "flex",
    gap: `${size * 0.08}px`,
    fontSize: `${size}px`,
    lineHeight: "1",
    whiteSpace: "nowrap",
    pointerEvents: "none",
    zIndex: "9999",
    willChange: "transform",
  });

  ["🎊", "🐀", "🐀", "🐀"].forEach((emoji, i) => {
    const el = document.createElement("span");
    el.textContent = emoji;
    wrap.appendChild(el);
    el.animate(
      [
        { transform: "translateY(0)" },
        { transform: `translateY(${-size * 0.25}px)` },
        { transform: "translateY(0)" },
      ],
      { duration: 350, iterations: Infinity, delay: i * 90, easing: "ease-in-out" }
    );
  });

  document.body.appendChild(wrap);

  const width = wrap.offsetWidth;
  const anim = wrap.animate(
    [
      { transform: `translateX(${window.innerWidth}px)` },
      { transform: `translateX(${-width}px)` },
    ],
    { duration, easing: "linear", fill: "forwards" }
  );
  anim.onfinish = () => wrap.remove();
}