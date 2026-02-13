import { useEffect, useState } from "react";
import { api } from "../../api/axiosInstance";
import type { EnrollmentItem } from "../../types/EnrollmentItem";
import HeadRenderer from "../../components/my/HeadRenderer";
import EnrollmentRenderer from "../../components/my/EnrollmentRenderer";

export default function MyPage() {
    const [loading, setLoading] = useState(true);
    const [picked, setPicked] = useState<"Class" | "QnA" | "Post" | "Comment">("Class");
    const [classes, setClasses] = useState<EnrollmentItem[]>([]);
    const handlePick = (item: "Class" | "QnA" | "Post" | "Comment") => {
        setPicked(item);
    }
    useEffect(() => {
        //API call
        switch(picked) {
            case "Class":
                api.get("/me/enrollments").then(res => {
                    setClasses(res.data.content);
                });
                break;
            default:
                console.log("Picked item:", picked);
                break;
        }
        setLoading(false);
    }, [picked]);
    if(loading) {
        return (<div>...</div>);
    }
    return(
        <div className="w-full h-screen">
            <section>
                <div className="mb-8 flex flex-col">
                    <HeadRenderer />
                    <div className="divider mx-20"/>
                </div>
            </section>
            <section>
                <div className={`flex h-screen`}>
                    <Picker picked={picked} onPick={handlePick} />
                    {picked === "Class" && (
                        <EnrollmentRenderer classes={classes} />
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