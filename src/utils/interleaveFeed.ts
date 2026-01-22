import type { FeedDto } from "../types/FeedDto";

export function smartInterleave(feedItems: FeedDto[]): FeedDto[] {
  if (!Array.isArray(feedItems) || feedItems.length === 0) {
    return [];
  }
  // 1. 타입별 그룹화
  const groups = new Map<string, FeedDto[]>();

  for (const item of feedItems) {
    if (!groups.has(item.itemType)) {
      groups.set(item.itemType, []);
    }
    groups.get(item.itemType)!.push(item);
  }

  // 2. 주 타입(anchor) 선정
  const sorted = [...groups.entries()].sort(
    (a, b) => b[1].length - a[1].length
  );

  const [anchorType, anchorList] = sorted[0];
  if(anchorType === "LIVE") {
    // LIVE가 주 타입인 경우 혼합하지 않고 그대로 반환, 일반적으로 LIVE는 FeedList에서 걸러지나 여기서 안전망을 부여
    return feedItems;
  }
  const others = sorted.slice(1);

  const A = anchorList.length;
  const B = others.reduce((sum, [, list]) => sum + list.length, 0);

  // 안전장치
  if (B === 0) return [...anchorList];

  const interval = Math.floor(A / B);

  // 3️⃣ CASE 1: interval >= 2
  if (interval >= 2) {
    const result: FeedDto[] = [];
    let anchorIdx = 0;

    // other items를 하나의 순환 큐로
    const otherQueue = others.flatMap(([, list]) => list);
    let otherIdx = 0;

    while (anchorIdx < A) {
      // anchor interval만큼 push
      for (let i = 0; i < interval && anchorIdx < A; i++) {
        result.push(anchorList[anchorIdx++]);
      }

      // 다른 타입 1개 삽입
      if (otherIdx < otherQueue.length) {
        result.push(otherQueue[otherIdx++]);
      }
    }

    // 남은 other
    while (otherIdx < otherQueue.length) {
      result.push(otherQueue[otherIdx++]);
    }

    return result;
  }

  // 4️⃣ CASE 2: interval < 2 → 완전 혼합
  const queues = sorted.map(([, list]) => [...list]);
  const result: FeedDto[] = [];

  let exhausted = false;
  while (!exhausted) {
    exhausted = true;

    for (const q of queues) {
      if (q.length > 0) {
        result.push(q.shift()!);
        exhausted = false;
      }
    }
  }

  return result;
}
