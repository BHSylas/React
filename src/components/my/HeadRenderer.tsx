import { useAuth } from "../../hooks/useAuth";
import displayRole from "../../utils/displayRole";
import { withdrawMember } from "../../types/authService";
import { useState } from "react";
import { updateProfessorProfile, getMyProfessorProfile } from "../../types/profProfile";
import { getUserIdFromToken } from "../../types/decodeToken";


export default function HeadRenderer() {
    const { name, nickname, role, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false); // 수정 여부
    const [editData, setEditData] = useState({ // 수정 프로필 데이터
        bio: "",
        specialty: "",
        career: "",
        office: "",
        contactEmail: ""
    }); // 수정 데이터 확인
    const isProfessor = role === "1"; // 교수 권한

    const handleWithdraw = async () => {
        if (!window.confirm("정말로 탈퇴하시겠습니까? 데이터는 복구되지 않습니다.")) return;

        try {
            await withdrawMember();
            localStorage.setItem("isWithdrawing", "true");
            alert("탈퇴가 왼료되었습니다. 이용해주셔서 감사합니다.");
            logout();
            window.location.href = "/";
        } catch (e) {
            alert("탈퇴 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
        }
    };

    const handleStartEditing = async () => {
        const token = localStorage.getItem("token");
        const userId = getUserIdFromToken(token);

        if (!userId) {
            alert("사용자 정보를 확인할 수 없습니다. 다시 로그인해주세요.");
            return;
        }
        try {
            // 서버에서 기존 프로필 데이터를 가져옴
            const currentProfile = await getMyProfessorProfile(userId);

            // 가져온 데이터를 수정 폼(state)에 세팅
            setEditData({
                bio: currentProfile.bio || "",
                specialty: currentProfile.specialty || "",
                career: currentProfile.career || "",
                office: currentProfile.office || "",
                contactEmail: currentProfile.contactEmail || ""
            });
            // 모달 열기
            setIsEditing(true);
        } catch (e) {
            console.error(e);
            alert("기존 프로필 정보를 불러오는 데 실패했습니다.");
        }
    }

    const handleUpdateProfile = async () => {
        if (editData.bio.length > 1000) return alert("자기소개는 1000자 이내여야 합니다.");

        try {
            await updateProfessorProfile(editData);
            alert("프로필이 성공적으로 수정되었습니다.");
            setIsEditing(false);
            window.location.reload(); // 데이터 갱신을 위해 리로드하거나 state 업데이트
        } catch (e) {
            alert("수정 중 오류가 발생했습니다.");
        }
    };

    if (!name || !nickname || !role) {
        return <div className="p-6">사용자 정보를 불러오는 중...</div>;
    }

    console.log("현재 role 값:", role);
    console.log("parseInt 결과:", parseInt(role as string));
    return (
        <div className="relative overflow-hidden bg-gray-100 rounded-[1rem] p-10 border border-gray-100">

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">My Profile</h1>
                    <p className="text-gray-500 font-medium">오늘의 학습 현황을 확인해보세요.</p>
                </div>

                <div className="flex flex-wrap gap-4">
                    {/* 정보 카드 세트 */}
                    {[
                        { label: "이름", value: name },
                        { label: "닉네임", value: nickname },
                        { label: "사용자 등급", value: displayRole(role), highlight: true }
                    ].map((info, i) => (
                        <div key={i} className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-gray-100">
                            <span className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">
                                {info.label}
                            </span>
                            <span className={`text-lg font-black ${info.highlight ? "text-blue-700" : "text-gray-800"}`}>
                                {info.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-between mt-3">
                <button
                    onClick={handleWithdraw}
                    className="text-red-500 text-[11px] text-bold hover:text-red-600">
                    회원 탈퇴
                </button>
                {isProfessor && (
                    <button
                        onClick={handleStartEditing} // 실제 데이터를 전달하도록 수정 필요
                        className="text-blue-500 text-[11px] text-bold hover:text-blue-600">
                        프로필 수정하기
                    </button>
                )}
            </div>
            {/* 수정 모달 (Overlay) */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-lg rounded-[1rem] p-8 shadow-2xl max-h-[100vh] overflow-y-auto">
                        <h2 className="text-2xl font-black text-gray-900 mb-6">교수 프로필 수정</h2>

                        <div className="space-y-4">
                            {[
                                { id: "specialty", label: "전공 분야", type: "text" },
                                { id: "office", label: "연구실 위치", type: "text" },
                                { id: "career", label: "경력", type: "text" },
                                { id: "contactEmail", label: "연락처 이메일", type: "email" }
                            ].map((field) => (
                                <div key={field.id}>
                                    <label className="block text-[15px] font-black text-blue-600 mb-1 uppercase">{field.label}</label>
                                    <input
                                        type={field.type}
                                        className="w-full border border-black rounded-xl px-4 py-2 text-sm"
                                        value={(editData as any)[field.id]}
                                        onChange={(e) => setEditData({ ...editData, [field.id]: e.target.value })}
                                    />
                                </div>
                            ))}

                            <div>
                                <label className="block text-[15px] font-black text-blue-600 mb-1 uppercase">자기소개</label>
                                <textarea
                                    className="w-full border border-black rounded-xl px-4 py-2 text-sm h-24 resize-none"
                                    value={editData.bio}
                                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all">
                                취소
                            </button>
                            <button
                                onClick={handleUpdateProfile}
                                className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                                저장하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}