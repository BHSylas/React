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
    if(role === '0') {
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
        <main>
            <h3 className="font-bold text-2xl mb-5">메타 테스트 목록</h3>
            <div>
                <ul className="m-auto p-1">
                    <li className="flex items-center text-center leading-8 m-auto border-b-2 border-gray-200 bg-gray-100 pt-1 pb-1">
                        <span className="w-[30%] font-bold">강의명</span>
                        <span className="w-[30%] font-bold">주제</span>
                        <span className="w-[10%] font-bold">언어</span>
                        <span className="w-[10%] font-bold">국가</span>
                        <span className="w-[10%] font-bold">난이도</span>
                    </li>
                    {listItems.length > 0 ? (
                        listItems.map((item) => (
                            <li key={item.id}
                                className="flex items-center text-center leading-8  border-b border-gray-200 cursor-pointer pt-1 pb-1"
                                onClick={() => navigate(`/metaverse/page/${item.id}`)}>
                                <span className="w-[30%]">{item.lectureTitle}</span>
                                <span className="w-[30%]">{item.topic || '주제 없음'}</span>
                                <span className="w-[10%]">{getLanguageName(item.country)}</span>
                                <span className="w-[10%]">{getCountryName(item.country)}</span>
                                <span className="w-[10%]">{getLevelName(item.level)}</span>
                            </li>
                        ))
                    ) : (
                        <p>표시할 데이터가 없습니다.</p>
                    )}
                </ul>
            </div>
        </main >
    );
};

export default MetaList;

