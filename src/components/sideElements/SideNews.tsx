import type { NewsDto } from "../../types/NewsDto";

interface NewsProps {
  news: NewsDto;
  onPreview: () => void;
}

export default function SideNews({news, onPreview} : NewsProps) {
    return (
    <div className="bg-base-100 shadow rounded-xl p-4 h-30 flex items-center justify-center text-base-content/60 mx-4 mt-4">
        {/* Empty state placeholder */}
        <div className="flex-col">
            <div className="flex text-2xl font-bold">[소식]</div>
            <div className="flex-1 line-clamp-2 break-words">{news.title}</div>
        </div>
        <a className="btn btn-xs h-content/60" onClick={() => onPreview()}>[더보기]</a>
    </div>);
}