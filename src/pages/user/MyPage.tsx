import { useEffect, useState } from "react";
// import { api } from "../../api/axiosInstance";
import type { EnrollmentItem } from "../../types/EnrollmentItem";
import HeadRenderer from "../../components/my/HeadRenderer";
import EnrollmentRenderer from "../../components/my/EnrollmentRenderer";
import { useAuth } from "../../hooks/useAuth";
import { ProfClassList } from "../../components/prof/my/ProfClassList";
import { MyActivityRenderer } from "../../components/my/MyActivityRenderer";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
    sub: string;
}

export default function MyPage() {
    const [loading, setLoading] = useState(true);
    const [picked, setPicked] = useState<"Class" | "QnA" | "Post" | "Comment">("Class");
    const [classes, setClasses] = useState<EnrollmentItem[]>([]);
    const [contentList, setContentList] = useState<any[]>([]);

    const handlePick = (item: "Class" | "QnA" | "Post" | "Comment") => {
        setPicked(item);
    }

    const { role, nickname } = useAuth();
    useEffect(() => {
        const fetchData = async () => {
            if (picked === "Class" && Number(role) === 1) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setContentList([]);
            const token = localStorage.getItem("token");
            let currentSub: string | null = null;
            if (token) {
                try {
                    const decoded = jwtDecode<TokenPayload>(token);
                    currentSub = decoded.sub;
                } catch (e) {
                    console.error("토큰 디코딩 실패", e);
                }
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            try {
                switch (picked) {
                    case "Class":
                        const res = await axios.get("/api/me/enrollments", config);
                        setClasses(res.data.content || []);
                        break;
                    case "QnA":
                    case "Post":
                        // QnA 게시판에서 내 닉네임으로 작성된 것만
                        const boardRes = await axios.get("/api/boards/searchBoard?size=1000", config);
                        const boardData = boardRes.data.content || [];
                        let myLectureIds: any[] = []; // 강의 아이디 저장
                        if (Number(role) === 1 && picked === "QnA") {
                            try {
                                const lecturesRes = await axios.get(`/api/lectures?size=1000`, config); // 강의목록
                                const allLectures = lecturesRes.data.content || []; // 강의 내용
                                myLectureIds = allLectures
                                    .filter((lec: any) => String(lec.professorId) === String(currentSub))
                                    // 교수아이디와 로그인 계정 id을 비교
                                    .map((lec: any) => lec.lectureId); // 맞는 거에서 강의아이디 가져옴
                            } catch (e) {
                                console.error("강의 목록 조회 실패", e);
                            }
                        }
                        const filtered = boardData.filter((item: any) => {
                            const isAuthor = item.writerName?.trim() === nickname?.trim();
                            if (picked === "QnA") {
                                if (Number(role) === 1) return item.boardType === "LECTURE_QNA" && myLectureIds.includes(item.lectureId);
                                if (Number(role) === 2) return item.boardType === "QNA";
                                return isAuthor && item.boardType === "LECTURE_QNA"; // 학생이면
                            }
                            return isAuthor;
                        });
                        setContentList(filtered);
                        break;
                    case "Comment":
                        const cr = await axios.get("/api/boards/comments/me", config);
                        const commentData = cr.data.content || cr.data || [];
                        const seenIds = new Set();
                        const uniqueComments = commentData.filter((item: any) => {
                            if (seenIds.has(item.id)) {
                                return false; // 이미 있는 ID면 제외
                            }
                            seenIds.add(item.id);
                            return true;
                        });
                        setContentList(uniqueComments);
                        break;
                }
            } catch (error) {
                console.error("데이터 로딩 실패:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [picked, nickname, role]);

    if (loading) {
        return (<div>...</div>);
    }

    return (
        <div className="w-full h-screen">
            <section>
                <div className="mb-8 flex flex-col">
                    <HeadRenderer />
                    <div className="divider mx-20" />
                </div>
            </section>
            <section>
                <div className={`flex h-screen`}>
                    <Picker picked={picked} onPick={handlePick} />
                    {picked === "Class" && (
                        Number(role) === 1 ? <div className="flex-1 px-8"> <ProfClassList /> </div>
                            : <EnrollmentRenderer classes={classes} />
                    )}
                    {picked !== "Class" && (
                        < MyActivityRenderer type={picked} data={contentList} />
                    )}
                </div>
            </section>
        </div>
    );
}

function Picker({ picked, onPick }: { picked: string; onPick: (item: any) => void }) {
    const items = ["Class", "QnA", "Post", "Comment"];
    return (
        <div className="flex flex-col gap-4 mb-8">
            {items.map((item) => {
                const isPicked = picked === item;
                return (
                    <div
                        key={item}
                        className={`cursor-pointer text-2xl text-center font-bold p-4 border-r-4 ${isPicked ? "border-blue-800 text-blue-800" : "border-transparent text-gray-500"
                            }`}
                        onClick={() => onPick(item as any)}
                    >
                        {item}
                    </div>
                );
            })}
        </div>
    );
}