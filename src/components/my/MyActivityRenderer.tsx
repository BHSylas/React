import { useNavigate } from "react-router";

export function MyActivityRenderer({ type, data }: { type: string, data: any[] }) {

    const formatOnlyDate = (dateString: string) => {
        if (!dateString) return "";
        return dateString.split('T')[0] //2026-00-00
            .replace(/-/g, '.'); // -를 .으로 변경
    };

    const navigate = useNavigate();
    const hanbleItemClick = (boradId: number) => {
        navigate(`/board/${boradId}`);
    }

    if (data.length === 0) {
        return (
            <div className="flex-1 py-24 text-center">
                <p className="text-gray-300 font-medium tracking-tight">작성하신 {type} 내역이 존재하지 않습니다.</p>
            </div>
        );
    }

    return (
        <div className="flex-1">
            {/* 상단 헤더: 진한 검정 선으로 섹션 구분 */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-gray-900 w-full">
                <h2 className="text-[22px] font-black text-gray-900 tracking-tight">{type} 내역</h2>
                <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                    Activity Log
                </span>
            </div>

            {/* 리스트 본문 */}
            <div className="divide-y divide-gray-500">
                {data.map((item, index) => (
                    <div
                        key={item.boardId || item.commentId || `activity-${index}`}
                        className="group flex flex-col md:flex-row md:items-center justify-between gap-2 py-6 px-4 cursor-pointer transition-all hover:bg-gray-50/50"
                        onClick={() => hanbleItemClick(item.boardId)}
                    >
                        <div className="flex-1">
                            <div className="text-[16px] font-black text-gray-900 group-hover:text-blue-600 transition-colors truncate tracking-tight mb-1">
                                {item.title || item.content}
                            </div>
                            {item.commentId && item.title && (
                                <p className="text-[12px] text-gray-400 font-medium italic">Re: {item.title}</p>
                            )}
                        </div>

                        <div className="shrink-0 md:text-right">
                            <span className="text-[13px] font-bold font-mono text-gray-400 group-hover:text-gray-900 transition-colors">
                                {formatOnlyDate(item.createdAt)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 하단 마무리 선 */}
            <div className="border-t border-gray-500 mt-2"></div>
        </div>
    );
}