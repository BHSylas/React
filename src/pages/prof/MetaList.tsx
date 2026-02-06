import { useEffect, useState } from "react"
import { api } from "../../api/axiosInstance"

interface MetaListItem {
    id: number,
    professorId: number,
    lectureId: number,
    lectureTitle: string,
    country: string,
    level: string,
    topic: string,
    active: boolean,
    nextConversationId: number,
}

const countryToLanguage: Record<string, string> = {
    USA: '영어',
    JAPAN: '일본어',
    CHINA: '중국어',
    GERMANY: '독일어',
    ITALY: '이탈리아어'
};

const MetaList = () => {
    const [listItems, setListItems] = useState<MetaListItem[]>([]);
    const [isLoading, setIsLoding] = useState<boolean>(true);

    useEffect(() => {
        api.get(`/professor/npc/list`).then(res => {
            if (res && res.data) {
                setListItems(res.data);
            }
        }).catch(err => {
            console.log("데이터 로딩 실패: ", err);
        }).finally(() => {
            setIsLoding(false);
        });
    }, []);

    const getLanguageName = (code: string) => {
        return countryToLanguage[code] || code; 
    };

    if (isLoading) return <div>로딩중...</div>

    return (
        <main>
            <h3>메타 테스트 목록</h3>
            <div>
                {listItems.length > 0 ? (
                    listItems.map((item) => (
                        <div key={item.id}>
                            <div>
                                <span>주제: {item.topic}</span>
                                <span>강의명: {item.lectureTitle}</span>
                                <p>언어: {getLanguageName(item.country)}</p>
                                <p>난이도: {item.level}</p>
                                <p>다음 문제 ID: {item.nextConversationId}</p>
                                <p>상태: {item.active ? "활성" : "비활성"}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>표시할 데이터가 없습니다.</p>
                )}
            </div>
        </main>
    );
};

export default MetaList;

