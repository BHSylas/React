// types/post.ts
export interface PostSummary {
  id: number;
  title: string;
  authorName: string;
  createdAt: string;
}

export interface AdminPost{
  id: number;
  title: string;
  authorName: string;
  createdAt: string;
  deleted: boolean;
}

export interface PageResponse<T> {
  content: T[];
  number: number;
  totalPages: number;
  totalElements: number;
  size: number;
  first: boolean;
  last: boolean;
}
