export function parseKoreanDate(dateStr: string): Date | null {
  // 공백 제거 및 안전 처리
  if (!dateStr) return null;

  // 정규식으로 연/월/일 추출
  const regex = /(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/;
  const match = dateStr.match(regex);

  if (!match) return null;

  const [, year, month, day] = match.map(Number);

  // month는 JS Date에서 0 기반이므로 -1 필요
  return new Date(year, month - 1, day);
}