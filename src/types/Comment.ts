export interface CommentDto
{
    id: number,
    postId: number,
    parentId: number | null,
    createdAt: string,
    updatedAt: string,
    content: string,
    author: string,
}