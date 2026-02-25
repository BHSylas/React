export interface StudentEnrollment {
    enrollmentId: number;
    studentNickname: string;
    progressRate: number; // 진도율
    status: string; // 강의 진행 상태
    completedAt: string | null; // 수료일(아직 안되었으면 null)
}

export interface LectureStats {
    lectureId: number;
    enrolledCount: number;      // 총 수강생 수
    avgProgressRate: number;    // 평균 진도율
    completedCount: number;  // 수강 완료 인원
}