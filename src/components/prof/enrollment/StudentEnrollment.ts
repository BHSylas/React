export type EnrollmentStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';

export interface LectureStudentEnrollmentItem {
    enrollmentId: number;
    studentId: number;
    studentNickname: string;
    studentEmail: string;
    status: EnrollmentStatus;
    progressRate: number;
    lastWatchedTime: number;
    totalDuration: number;
    lastAccessedAt: string;
    completedAt: string | null;
}

export interface PageResponse<T> {
    content: T[];
    totalPage: number;
    totalElements: number;
    size: number;
    number: number;
}