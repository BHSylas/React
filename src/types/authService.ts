import axios from "axios"

export const withdrawMember = async (): Promise<void> => {
    const token = localStorage.getItem("token");

    try {
        const response = await axios.delete("/api/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log("탈퇴 요청 결과:", response.data);
        
    } catch (e) {
        console.error(e, "회원 탈퇴 요청 중 오류 발생");
        throw e;
    }
}