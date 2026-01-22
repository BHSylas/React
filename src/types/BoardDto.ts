export interface BoardDto {
    id: number,
    playerId: number,
    title: string,
    content: string,
    author: string,
    media: string | null,
    createdAt: string,
    updatedAt: string,
    views: number
}