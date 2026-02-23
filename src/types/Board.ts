export interface Board {
  boardId: number;
  title: string;
  writerName: string;
  createdAt: string;
  content: string;
  viewCount: number;
  commentCount: number;
  boardType: string;
  pinned: boolean;
  answered: boolean;
}
