export function flyCoconut(targetEl, onLand, duration = 750) {
  const size = 32;
  const coconut = document.createElement("span");
  coconut.textContent = "🥥";
  Object.assign(coconut.style, {
    position: "fixed",
    left: "0",
    top: "0",
    fontSize: `${size}px`,
    lineHeight: "1",
    pointerEvents: "none",
    zIndex: "9999",
    willChange: "transform",
  });
  document.body.appendChild(coconut);

  const rect = targetEl.getBoundingClientRect();
  const endX = rect.left + rect.width / 2 - size / 2;
  const endY = rect.top + rect.height / 2 - size / 2;

  const startX = window.innerWidth / 2 - size / 2 + (Math.random() - 0.5) * 160;
  const startY = window.innerHeight + 10;


  const midX = (startX + endX) / 2 + (Math.random() - 0.5) * 140;
  const midY = endY + (startY - endY) * 0.4;

  const anim = coconut.animate(
    [
      { transform: `translate(${startX}px, ${startY}px) rotate(0deg) scale(1)` },
      { transform: `translate(${midX}px, ${midY}px) rotate(360deg) scale(1.25)`, offset: 0.5 },
      { transform: `translate(${endX}px, ${endY}px) rotate(720deg) scale(0.6)` },
    ],
    { duration, easing: "cubic-bezier(0.3, 0.1, 0.3, 1)", fill: "forwards" }
  );

  anim.onfinish = () => {
    coconut.remove();
    onLand();
  };
}