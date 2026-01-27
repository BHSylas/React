import { useParams } from "react-router-dom";
import Overview from "../../components/class/desc/Overview";
import TopPanel from "../../components/class/desc/TopPanel";
import ReviewBlock from "../../components/review/ReviewBlock";

export default function ClassViewPage() {
    const classId = useParams().classId;
  return (
    <main>
      <TopPanel
        title="실전 영어 회화 마스터"
        instructor="홍길동"
        category="영어"
        level="초급"
        duration="총 12시간"
      />

      <Overview
        description="이 강의는 일상에서 바로 사용할 수 있는 영어 회화를 중심으로 구성되어 있습니다."
        objectives={[
          "기본적인 일상 회화 표현 익히기",
          "상황별 실전 문장 학습",
          "자연스러운 발음과 억양 습득",
        ]}
        instructorBio="홍길동 강사는 동에 번쩍 서에 번쩍 돌아다니는 시간 강사로 수상하지 않습니다. 실제 의롭습니다."
      />

      <ReviewBlock />
      <div>{classId}</div>
    </main>
  );
}
