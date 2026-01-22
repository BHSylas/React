export function textLimiter(text: string | null, maxLength: number): string {
  if(text === null) return "";
  if (text.length <= maxLength) {
    return text;
  }
    return text.slice(0, maxLength) + "...";
}