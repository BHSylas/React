import axios from "axios";
// import { api } from "../../api/axiosInstance";

interface AdminUserDTO {
    userId: number;
    email: string;
    name: string
    nickname: string;
    roleCode: number;
    roleName: string;
    status: string;
    createdAt: string;
}

interface ModalProps {
    user: AdminUserDTO;
    onClose: () => void;
    onUpdate: () => void; // 수정 성공시 리스트를 새로고침 하기 위한 콜백
}

export function UserDetailModal({ user, onClose, onUpdate }: ModalProps) {
    const token = localStorage.getItem("token");

    const handleUpdateUser = async (field: 'roleCode' | 'status', value: string | number) => {
        try {
            // 백엔드 구조의 맞게 변경 처리(권한 변경시 권한api 으로 상태 변경시 상태 api로)
            const endpoint = `/api/admin/users/${user.userId}/${field === 'roleCode' ? 'role' : 'status'}`;

            let payload = {};

            if (field === 'roleCode') {
                // [매핑] 숫자(0,1,2)를 백엔드 Enum 명칭(USER, PROFESSOR, ADMIN)으로 변환
                const roleMap: { [key: number]: string } = {
                    0: "USER",
                    1: "PROFESSOR",
                    2: "ADMIN"
                };
                payload = { role: roleMap[Number(value)] };
            } else {
                // 만약 value가 'ACTIVE'가 아니면 무조건 'BLOCKED'로 전달
                payload = { status: value === "ACTIVE" ? "ACTIVE" : "BLOCKED" };
            }

            await axios.patch(endpoint, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            alert("유저 정보가 변경되었습니다.");
            onUpdate();
        } catch (e: any) {
            console.error("수정 실패 상세:", e.response?.data);
            alert(`변경 실패: ${e.response?.data?.message || "서버 오류"}`);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            {/* 모달 컨테이너 */}
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* 상단 헤더 섹션 */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-black text-gray-900">{user.nickname}</h3>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${user.roleCode === 2 ? 'bg-purple-100 text-purple-700' :
                                user.roleCode === 1 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                {user.roleCode === 2 ? '관리자' : user.roleCode === 1 ? '교수' : '일반 유저'}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-2xl">&times;</button>
                </div>

                {/* 바디 섹션 (정보 요약 및 설정) */}
                <div className="p-8 space-y-8">

                    {/* 대시보드형 미니 카드 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 transition-hover hover:border-blue-200">
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">실명</p>
                            <p className="text-lg font-bold text-gray-800">{user.name}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">가입 일자</p>
                            <p className="text-lg font-bold text-gray-800">{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* 제어 섹션 */}
                    <div className="space-y-5">
                        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 italic">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                            Account Management
                        </h4>

                        <div className="grid grid-cols-1 gap-4">
                            {/* 권한 변경 */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 ml-1">권한 등급 조정</label>
                                <select
                                    value={user.roleCode}
                                    onChange={(e) => handleUpdateUser('roleCode', Number(e.target.value))}
                                    className="w-full p-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold shadow-sm"
                                >
                                    <option value={0}>유저 (USER)</option>
                                    <option value={1}>교수 (PROFESSOR)</option>
                                    <option value={2}>관리자 (ADMIN)</option>
                                </select>
                            </div>

                            {/* 상태 변경 */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 ml-1">계정 상태 설정</label>
                                <select
                                    value={user.status === "ACTIVE" ? "ACTIVE" : "BLOCKED"}
                                    onChange={(e) => handleUpdateUser('status', e.target.value)}
                                    className="w-full p-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold shadow-sm"
                                >
                                    <option value="ACTIVE">활성 (ACTIVE)</option>
                                    <option value="BLOCKED">정지 (BLOCKED)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}