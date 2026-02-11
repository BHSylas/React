import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../api/axiosInstance";
import type { ClassItem } from "../../types/ClassItem";

export default function AdminLecturePage() {
    const role = useContext(AuthContext).role;
    const [state, setState] = useState<"ALL"|"PENDING"|"APPROVED"|"REJECTED">("PENDING");
    const [lectures, setLectures] = useState<ClassItem[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        api.get(`/admin/lectures?status=${state}`).then((res) => {
            setLectures(res.data.content);
            console.log(res.data.content);
        });
    }, [state]);
    const approveLecture = (lectureId: string) => {
        api.patch(`/admin/lectures/${lectureId}/approval`).then(() => {
            alert("승인되었습니다.");
            setLectures(lectures.filter(lec => lec.lectureId !== lectureId));
        });}
    const rejectLecture = (lectureId: string) => {
        api.patch(`/admin/lectures/${lectureId}/rejection`).then(() => {
            alert("승인되었습니다.");
            setLectures(lectures.filter(lec => lec.lectureId !== lectureId));
        });}
    if(role === null) {
        console.log("No role, probably waiting for auth...");
        return <div>Loading...</div>;
    }
    else if(role !== '2') {
        alert("No exception!");
        navigate('/');
    }
    return(
    <div>
        <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-center m-4">강의 관리</h1>
            <StatusSelector currentStatus={state} setStatus={setState} />
            <AdminClassList classList={lectures} approveLecture={approveLecture} rejectLecture={rejectLecture} />
        </div>
    </div>
    );
}

function AdminClassList({ classList, approveLecture, rejectLecture }: { classList: ClassItem[], approveLecture: (lectureId: string) => void, rejectLecture: (lectureId: string) => void }) {
    if(classList.length === 0) {
        return <div className="text-center py-10">해당하는 강의가 없습니다.</div>;
    }
  return (
    <div
      className={`space-y-4 transition-opacity opacity-100`}
    >
      {classList.map((item) => (
        <div className="block" key={item.lectureId}>
          <ClassListItem key={item.lectureId} item={item} approveLecture={approveLecture} rejectLecture={rejectLecture} />
          </div>
      ))}
    </div>
  );
}

function ClassListItem({ item, approveLecture, rejectLecture }: { item: ClassItem, approveLecture: (lectureId: string) => void, rejectLecture: (lectureId: string) => void }) {
  return (
    <div className="flex gap-4 p-3 border rounded-lg cursor-pointer hover:shadow-lg transition-shadow">
      <div className="w-40 h-24 bg-gray-300 rounded" />
      <div>
        <h3 className="font-bold">{item.title}</h3>
        <p className="text-sm text-gray-600">
          {item.professorNickname} · {item.country}
        </p>
        <p className="text-sm mt-2 text-gray-700">
          {item.description}
        </p>
      </div>
      {item.status === "PENDING" && <div className="ml-auto">
        <button className="text-green-500 hover:text-green-800 hover:scale-105 transition-all px-3 py-1 rounded mr-2" onClick={() => approveLecture(item.lectureId)}>승인</button>
        <button className="text-red-500 hover:text-red-800 hover:scale-105 transition-all px-3 py-1 rounded" onClick={() => rejectLecture(item.lectureId)}>거절</button>
      </div>}
    </div>
  );
}

function StatusSelector({ currentStatus, setStatus }: { currentStatus: "ALL"|"PENDING"|"APPROVED"|"REJECTED", setStatus: (status: "ALL"|"PENDING"|"APPROVED"|"REJECTED") => void }) {
    const statuses: { label: string, value: "ALL"|"PENDING"|"APPROVED"|"REJECTED" }[] = [
        { label: "전체", value: "ALL" },
        { label: "승인 대기", value: "PENDING" },
        { label: "승인 완료", value: "APPROVED" },
        { label: "거절된 강의", value: "REJECTED" },
    ];
    return (
        <div className="flex justify-center gap-4 my-4">
            {statuses.map((status) => (
                <button
                    key={status.value}
                    className={`px-4 py-2 rounded ${currentStatus === status.value ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                    onClick={() => setStatus(status.value)}
                >
                    {status.label}
                </button>))}
        </div>);
}