export interface Comment {
    children: number[] | null,
    commentId: number,
    content: string,
    createdAt: string,
    depth: number,
    writerId: number,
    writerName: string,
}