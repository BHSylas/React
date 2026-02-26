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

    if (isLoading) return <div>로딩중...</div>

    return (
        <div className="flex-1">
            <h2 className="text-lg font-bold mb-3 border-b-2 pb-2 text-gray-800">Metaverse 테스트 목록</h2>
            <div className="min-h-[400px]">
                {/* <li className="flex items-center text-center leading-8 m-auto border-b-2 border-gray-200 bg-gray-100 pt-1 pb-1">
                        <span className="w-[30%] font-bold">강의명</span>
                        <span className="w-[30%] font-bold">주제</span>
                        <span className="w-[10%] font-bold">언어</span>
                        <span className="w-[10%] font-bold">국가</span>
                        <span className="w-[10%] font-bold">난이도</span>
                    </li> */}
                {listItems.length > 0 ? (
                    listItems.map((item) => (
                        <div key={item.id}
                            className="grid grid-cols-[1fr_1.2fr_100px_100px_100px] 
                                       gap-4 px-3 py-3 border-b cursor-pointer text-gray-600 
                                       hover:bg-gray-50 transition-colors text-center items-center"
                            onClick={() => navigate(`/metaverse/page/${item.id}`)}>
                            <span className="text-left font-medium text-blue-900 truncate">{item.lectureTitle}</span>
                            <span className="truncate text-gray-500">{item.topic || '주제 없음'}</span>
                            <span>{getLanguageName(item.country)}</span>
                            <span>{getCountryName(item.country)}</span>
                            <span>{getLevelName(item.level)}</span>
                        </div>
                    ))
                ) : (
                    <p>표시할 데이터가 없습니다.</p>
                )}
            </div>
            <div className="flex justify-end">
                <button onClick={() => navigate('/metaverse/upload')}
                    className="btn mt-5 px-4 py-2 text-sm font-medium rounded-md
                   bg-blue-800 text-white hover:bg-blue-900 transition-colors">문제 작성</button>
            </div>
        </div>
    );
};

export default MetaList;

