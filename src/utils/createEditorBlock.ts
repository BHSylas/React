import type { LiveBlock, PredictionBlock, TextBlock, VideoBlock } from "../types/Blocks";
import type { EditorBlock } from "../types/EditorBlocks";
import type { LiveDto } from "../types/LiveDto";
import type { MatchDto } from "../types/MatchDto";
import type { VideoResponseDto } from "../types/VideoResponseDto";

export function createPredictionEditorBlock(
  match: MatchDto
): EditorBlock<PredictionBlock> {
  return {
    key: crypto.randomUUID(),
    block: {
      id: "",
      type: "prediction",
      match,
    },
  };
}

export function createLiveEditorBlock(
  live: LiveDto
): EditorBlock<LiveBlock> {
  return {
    key: crypto.randomUUID(),
    block: {
      id: "",
      type: "live",
      live,
    },
  };
}

export function createVideoEditorBlock(
  video: VideoResponseDto
): EditorBlock<VideoBlock> {
  return {
    key: crypto.randomUUID(),
    block: {
      id: "",
      type: "video",
      video: video,
    },
  };
}

export function createTextEditorBlock(content: string = ""): EditorBlock<TextBlock>{
  return {key: crypto.randomUUID(),
    block: {
      id: "",               // 서버 전송 전에는 비워둬도 무방
      type: "text",
      content: content,
    },
  };
}

/*
if (block.type === "text") {
        result.push(createTextEditorBlock(block.content));
        return;
      }

      if (block.type === "prediction") {
        result.push(
          createPredictionEditorBlock({ id: block.matchId })
        );
        result.push(createTextEditorBlock());
        return;
      }

      if (block.type === "live") {
        result.push(
          createLiveEditorBlock({ videoId: block.videoId })
        );
        result.push(createTextEditorBlock());
        return;
      }

      if (block.type === "video") {
        result.push(
          createVideoEditorBlock({ videoId: block.videoId })
        );
        result.push(createTextEditorBlock());
        return;
      }
 */
