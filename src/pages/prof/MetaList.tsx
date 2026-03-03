import { useContext, useEffect, useState } from "react"
import axios from 'axios';
import { useNavigate } from "react-router";
import { getLanguageName, getLevelName, getCountryName } from "../../components/metaverse/ListRecord";
import { AuthContext } from "../../context/AuthContext";

interface MetaListItem {
    id: number,
    professorId: number,
    lectureId: number,
    lectureTitle: string,
    country: string,
    place: string,
    level: string,
    topic: string,
    active: boolean,
    nextConversationId: number,
}

export interface PageResponse<T> {
    content: T[];
    totalPage: number;
    totalElements: number;
    size: number;
    number: number; // 현재 페이지 번호(0부터 시작)
    last: boolean;
    first: boolean;
    empty: boolean;
}

const MetaList = () => {
    const [listItems, setListItems] = useState<MetaListItem[]>([]);
    const [isLoading, setIsLoding] = useState<boolean>(true);

    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0); // 총 페이지 수
    const navigate = useNavigate();
    const role = useContext(AuthContext).role;
    if (role === '0') {
        alert("No exception!");
        navigate('/');
    }
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const param: Record<string, any> = {
            page: page,
            size: 10
        };

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }, withCredentials: true,
            params: param
        };

        setIsLoding(true);

        axios.get<PageResponse<MetaListItem>>(`/api/professor/npc/list`, config).then(res => {
            if (res && res.data && Array.isArray(res.data.content)) {
                setListItems(res.data.content);
                setTotalPage(res.data.totalPage);
            }
        }).catch(err => {
            if (err.response) {
                // 서버가 응답한 에러 객체 전체 출력
                console.log("에러 데이터:", err.response.data);
                console.log("에러 상태:", err.response.status);
                console.log("에러 헤더:", err.response.headers);
            }
            console.log("데이터 로딩 실패: ", err);
        }).finally(() => {
            setIsLoding(false);
        });
    }, [page]);

    if (isLoading) return (
        <div className="flex-1 flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="flex-1"> {/* animate-in 클래스 제거 */}
            {/* 상단 헤더: 진한 검정 선으로 섹션 구분 */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-gray-900">
                <h2 className="text-[22px] font-black text-gray-900 tracking-tight">Metaverse 테스트 목록</h2>
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                        NPC Management
                    </span>
                </div>
            </div>

            {/* 리스트 본문 */}
            <div className="min-h-[400px] divide-y divide-gray-100">
                {listItems.length > 0 ? (
                    listItems.map((item) => (
                        <div key={item.id}
                            className="group grid grid-cols-[1.2fr_1.5fr_80px_80px_100px] 
                                       gap-6 px-4 py-6 cursor-pointer text-gray-600 
                                       hover:bg-gray-50/50 transition-all items-center -mx-4 rounded-xl"
                            onClick={() => navigate(`/metaverse/page/${item.id}`)}>

                            {/* 강의 제목 */}
                            <span className="text-left text-[16px] font-black text-gray-900 group-hover:text-blue-600 transition-colors truncate tracking-tight">
                                {item.lectureTitle}
                            </span>

                            {/* 주제: 연한 색상의 폰트 */}
                            <span className="truncate text-gray-400 font-medium text-[14px] italic">
                                {item.topic || '주제 없음'}
                            </span>

                            {/* 언어 & 국가 */}
                            <span className="text-center text-[13px] font-bold text-gray-500">
                                {getLanguageName(item.country)}
                            </span>
                            <span className="text-center text-[13px] font-bold text-gray-500">
                                {getCountryName(item.country)}
                            </span>

                            {/* 레벨 */}
                            <span className="text-right text-[13px] font-extrabold text-blue-600/80 pr-2">
                                {getLevelName(item.level)}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="py-24 text-center">
                        <p className="text-gray-300 font-medium tracking-tight">등록된 메타버스 테스트가 없습니다.</p>
                    </div>
                )}
            </div>

            <div className="flex justify-end">
                <button onClick={() => navigate('/metaverse/upload')}
                    className="group relative flex items-center gap-2 px-6 py-2.5 
                   bg-blue-600 text-white text-sm font-bold rounded-full
                   hover:bg-blue-700 hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)]
                   transition-all duration-300 active:scale-95 mt-10">문제 작성</button>
            </div>
        </div>
    );
};

export default MetaList;

