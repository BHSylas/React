interface BoardPostPanelProps {
  title: string;
  author: string;
  category: string;
  createdAt: string;
  content: string;
}

export function BoardPostPanel({
  title,
  author,
  category,
  createdAt,
  content,
}: BoardPostPanelProps) {
  return (
    <section className="rounded-lg space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">{title}</h1>
        <div className="text-sm text-gray-500 flex gap-2">
          <span>{author}</span>
          <span>·</span>
          <span>{category}</span>
          <span>·</span>
          <span>{createdAt}</span>
        </div>
      </div>

      {/* Content */}
      <div className="pt-4 text-sm text-gray-800 leading-relaxed whitespace-pre-line">
        {content}
      </div>
    </section>
  );
}
