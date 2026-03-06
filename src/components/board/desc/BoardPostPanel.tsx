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
    <section className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-snug">
          {title}
        </h1>

        <div className="text-[14px] flex items-center gap-2 font-bold text-gray-400">
          <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md text-[12px] uppercase tracking-wider">
            {displayCategory(boardType)}
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-700">{writerName}</span>
          <span className="font-light text-gray-300">·</span>
          <span className="font-medium text-gray-400">
            {new Date(createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="min-h-[500px] p-8 text-[16px] text-black leading-[1.8] whitespace-pre-line border border-black rounded-[1rem] font-medium">
        {content}
      </div>
    </section>
  );
}
