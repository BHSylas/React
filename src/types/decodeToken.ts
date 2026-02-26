export const getUserIdFromToken = (token: string | null): number | null => {
  if (!token) return null;
  try {
    const base64Payload = token.split(".")[1]; // 토큰의 payload 부분 추출
    const payload = JSON.parse(atob(base64Payload)); // base64 디코딩 후 JSON 파싱
    return Number(payload.sub); // sub 필드 반환 (문자열일 경우 숫자로 변환)
  } catch (e) {
    console.error("Token decode error:", e);
    return null;
  }
};