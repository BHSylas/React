import { useState, useEffect } from "react"
import { type ClassItem } from "../../../types/ClassItem";
import axios from "axios";
import { ClassListBlock } from "../List/profClassListBlock";
import { useNavigate } from "react-router";

export function ProfClassList() {
    const [classList, setClassList] = useState<ClassItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        axios.get('/api/instructor/lectures', {
            headers: {
                Authorization: `Bearer ${token}` // 토큰 전달
            }
        }).then(res => {
            if (res.data && Array.isArray(res.data.content)) {
                setClassList(res.data.content);
            } else {
                setClassList([]);
            }
        }).catch(err => {
            console.log("목록 불러오기 실패", err);
            alert("목록을 불러오지 못했습니다.");
            setLoading(false);
        }).finally(() => {
            // 3. 성공하든 실패하든 로딩 상태를 false로 변경
            setLoading(false);
        });
    }, []);


    return (
        <main>
            {loading ? (
                <div className="p-5 text-center">로딩 중...</div>
            ) : (
                <div>
                    {classList && classList.length > 0 ? (
                        <ClassListBlock classList={classList} />
                    ) : (
                        <div className="p-5 text-center">강의 목록이 없습니다.</div>
                    )}
                </div>
            )}
        </main>
    )
}