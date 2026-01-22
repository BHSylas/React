import type { Block, LiveBlock, PredictionBlock, TextBlock, VideoBlock } from "./Blocks";

export type EditorBlock<T extends Block = Block> = {
  key: string;   // 프런트 전용 (React key)
  block: T;
};

export type AnyEditorBlock =
  | EditorBlock<TextBlock>
  | EditorBlock<PredictionBlock>
  | EditorBlock<LiveBlock>
  | EditorBlock<VideoBlock>;
