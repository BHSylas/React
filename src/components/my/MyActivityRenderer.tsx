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

    if (data.length === 0) return <div className="p-5 text-gray-300"> 작성한 내역이 없습니다. </div>

    return (
        <div className="ml-3 w-full">
            <h2 className="text-lg font-bold mb-3 border-b-2 pb-2">{type} 내역</h2>
            <div className="divide-y cursor-pointer">
            {data.map((item) => (
                <div key={item.id}
                    className="w-full grid gap-1 p-3"
                    onClick={() => hanbleItemClick(item.boardId)}>
                    <div className="font-bold">{item.title || item.content}</div>
                    <div className="text-gray-600">{formatOnlyDate(item.createdAt)}</div>
                </div>
            ))}
            </div>
        </div>
    )
}