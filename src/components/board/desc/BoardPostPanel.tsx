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
        <h1 className="text-xl font-semibold">{post.title}</h1>
        <div className="text-sm text-gray-500 flex gap-2">
          <span>{writerName}</span>
          <span>·</span>
          <span>{boardType}</span>
          <span>·</span>
          <span>{createdAt}</span>*/}
        </div>
      </div>

      {/* Content */}
      <div className="pt-4 text-sm text-gray-800 leading-relaxed whitespace-pre-line">
        {post.content}
      </div>
    </section>
  );
}
