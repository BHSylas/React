type ScrollTarget = "top" | "bottom";

function easeInOutCubic(t: number) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function calcDuration(distance: number) {
  const abs = Math.abs(distance);
  const duration = abs * 0.4;

  return Math.min(Math.max(duration, 500), 1500);
}

export function scrollPage(
  target: ScrollTarget,
  duration?: number
) {
  const startY = window.scrollY;
  const maxScrollY =
    document.documentElement.scrollHeight - window.innerHeight;

  const endY = target === "top" ? 0 : maxScrollY;
  const distance = endY - startY;

  const resolvedDuration =
    duration ?? calcDuration(distance);

  const startTime = performance.now();

  function animate(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / resolvedDuration, 1);

    const eased = easeInOutCubic(progress);
    window.scrollTo(0, startY + distance * eased);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}
