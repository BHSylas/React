import { POST_IMAGES } from "../../public/covers/postImages";
import type { FeedDto } from "../types/FeedDto";

function hashStringToNumber(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}


export function pickPostImageFromItem(item: FeedDto): string {
  const seedSource =
    `${item.order}-${item.title}-${item.published}`;
  const seed = hashStringToNumber(seedSource);
  return POST_IMAGES[seed % POST_IMAGES.length];
}
