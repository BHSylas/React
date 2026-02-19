import displayCategory from "../../../utils/displayCategory";

export interface BoardPostPanelProps {
  title: string;
  writerName: string;
  boardType: string;
  createdAt: string;
  content: string;
}

export function BoardPostPanel({
  title,
  writerName,
  boardType,
  createdAt,
  content,
}: BoardPostPanelProps) {
  return (
    <section className="rounded-lg space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">{title}</h1>
        <div className="text-sm text-gray-500 flex gap-2">
          <span>{writerName}</span>
          <span>·</span>
          <span>{displayCategory(boardType)}</span>
          <span>·</span>
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Content */}
      <div className="pt-4 text-sm text-gray-800 leading-relaxed whitespace-pre-line">
        {content}
      </div>
    </section>
  );
}
