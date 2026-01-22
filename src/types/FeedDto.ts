export interface FeedDto {
    order: number;
    title: string;
    metadata: string;
    published: string;
    itemType: "MATCH" | "LIVE" | "VIDEO" | "POST";
}