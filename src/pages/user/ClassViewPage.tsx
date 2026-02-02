import { useParams } from "react-router-dom";
import Overview from "../../components/class/desc/Overview";
import TopPanel from "../../components/class/desc/TopPanel";
import ReviewBlock from "../../components/class/review/ReviewBlock";
import { useEffect, useState } from "react";
import { api } from "../../api/axiosInstance";
import type { ClassItem } from "../../types/ClassItem";

export default function ClassViewPage() { //현재 테스트 데이터 삽입 중
    const classId = useParams().classId;
    const [page, setPage] = useState<ClassItem | null>(null);
    const [enrolling, setEnrolling] = useState(true);
    useEffect(() => {
      api.get(`/lectures/${classId}`).then((res) => {
        setPage(res.data);
      });
      api.get(`/me/enrollments/${classId}`).catch(() => {
        setEnrolling(false);
      });
    }, []);
    if(page === null) {
    return <div>Loading...</div>;
    }
  return (
    <main>
      <TopPanel
        title={page.title}
        instructor={page.professorNickname}
        category={page.language.toUpperCase()}
        level={page.country}
        duration=""
        classId={classId}
        isEnrolling={enrolling}
      />

      <Overview
        description={page.description}
        objectives={["배움"]}
        instructorBio="홍길동 강사는 동에 번쩍 서에 번쩍 돌아다니는 시간 강사로 수상하지 않습니다. 실제 의롭습니다."
      />

      <ReviewBlock />
      <div>{classId}</div>
    </main>
  );
}
