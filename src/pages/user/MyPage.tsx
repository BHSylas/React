import { useEffect, useState } from "react";
// import { api } from "../../api/axiosInstance";
import type { EnrollmentItem } from "../../types/EnrollmentItem";
import HeadRenderer from "../../components/my/HeadRenderer";
import EnrollmentRenderer from "../../components/my/EnrollmentRenderer";
import { useAuth } from "../../hooks/useAuth";
import { ProfClassList } from "../../components/prof/my/ProfClassList";
import { MyActivityRenderer } from "../../components/my/MyActivityRenderer";
import axios from "axios";

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
                        const filtered = boardData.filter((item: any) => {
                            const isAuthor = item.writerName?.trim() === nickname?.trim();

                            if (picked === "QnA") return isAuthor && item.boardType === "LECTURE_QNA";
                            if (picked === "Post") return isAuthor;
                        });
                        setContentList(filtered);
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
    }, [picked, nickname]);
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

function Picker({ picked, onPick }: { picked: string; onPick: (item: "Class" | "QnA" | "Post" | "Comment") => void }) {
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
                        onClick={() => onPick(item as "Class" | "QnA" | "Post" | "Comment")}
                    >
                        {item}
                    </div>
                );
            })}
        </div>
    );
}