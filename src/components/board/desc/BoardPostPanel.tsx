import displayCategory from "../../../utils/displayCategory";

export interface BoardPostPanelProps {
  title: string;
  writerName: string;
  boardType: string;
  createdAt: string;
  content: string;
  lectureId: string;
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
        <h1 className="text-2xl font-semibold">{title}</h1>
        <div className="text-sm text-gray-500 flex gap-2">
          <span className="mt-2">{writerName}</span>
          <span className="mt-2">·</span>
          <span className="mt-2">{displayCategory(boardType)}</span>
          <span className="mt-2">·</span>
          <span className="mt-2">{new Date(createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-line border rounded-md  min-h-[500px]">
        {content}
      </div>
    </section>
  );
}
