import axios from "axios";

// 프로필 수정 업데이트용
interface UpdateProfilePayload {
    bio?: string; // 자기소개
    specialty?: string; // 전공
    career?: string; // 경력
    office?: string; // 연구실
    contactEmail?: string; // 이메일
    profileImageUrl?: string; // 프로필 이미지
}

// 확인할 수 있는 교수 프로필
export interface ProfessorProfileResponse {
    professorId: number; // 교수 아이디
    professorName: string; // 교수 이름
    professorNickname: string; // 교수 닉네임
    bio: string; // 여기서부터 위와 동일
    specialty: string;
    career: string;
    profileImageUrl: string;
    office: string;
    contactEmail: string;
}

export const getMyProfessorProfile = async (id: number): Promise<ProfessorProfileResponse> => {
    const token = localStorage.getItem("token");

    try {
        // 서버에 '내 정보' 조회 API가 없다면 '/api/professor/{id}/profile' 형태여야 합니다.
        const response = await axios.get(`/api/professor/${id}/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (e) {
        console.error("프로필 조회 중 오류 발생:", e);
        throw e;
    }
}

export const updateProfessorProfile = async (payload: UpdateProfilePayload): Promise<void> => {
    const token = localStorage.getItem("token");

    try {
        await axios.patch('/api/professor/me/profile', payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (e) {
        console.error(e, "프로필 수정 확인 중 오류 발생");
        throw e;
    }
}