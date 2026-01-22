import { useEffect, useRef, type RefObject } from "react";

export function useHorizontalWheel<T extends HTMLElement>(
  ref: RefObject<T | null>,
  enabled: boolean = true
) {
  const velocity = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const el = ref.current;

    const FRICTION = 0.75;   // 감속 (0.9 ~ 0.95 권장)
    const ACCELERATION = 0.8; // 입력 민감도

    const animate = () => {
      if (!ref.current) return;

      velocity.current *= FRICTION;

      if (Math.abs(velocity.current) < 0.1) {
        velocity.current = 0;
        rafId.current = null;
        return;
      }

      ref.current.scrollLeft += velocity.current;
      rafId.current = requestAnimationFrame(animate);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      velocity.current += e.deltaY * ACCELERATION;

      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(animate);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheel);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [ref, enabled]);
}
