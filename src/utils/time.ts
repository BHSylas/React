export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00:00";
  const s = Math.floor(sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return `${h}:${m.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}`;
}

export function secondsToCeilMinutes(sec: number) {
  if (!Number.isFinite(sec) || sec <= 0) return 1;
  return Math.max(1, Math.ceil(sec / 60));
}

export function calcProgressPercent(currentSec: number, durationSec: number) {
  if (!Number.isFinite(durationSec) || durationSec <= 0) return 0;
  const p = (currentSec / durationSec) * 100;
  return clamp(Math.round(p * 10) / 10, 0, 100); // 소수 1자리
}
