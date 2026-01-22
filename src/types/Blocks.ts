import type { LiveDto } from "./LiveDto";
import type { MatchDto } from "./MatchDto";
import type { VideoResponseDto } from "./VideoResponseDto";

export interface Block{
    id: string;
    type: string;
}

export interface TextBlock extends Block{
    type: "text";
  content: string;
};

export interface PredictionBlock extends Block{
    type: "prediction";
    match: MatchDto | null;
};

export interface LiveBlock extends Block{
    type: "live";
    live: LiveDto | null;
}

export interface VideoBlock extends Block{
    type: "video";
    video: VideoResponseDto | null;
}
