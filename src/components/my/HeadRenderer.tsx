import { useAuth } from "../../hooks/useAuth";
import displayRole from "../../utils/displayRole";

export default function HeadRenderer() {
    const { name, nickname, role } = useAuth();
    if (!name || !nickname || !role) {
        return <div className="p-6">사용자 정보를 불러오는 중...</div>;
    }
    return (
        <div className="relative overflow-hidden bg-gray-50 rounded-[1rem] p-10 border border-gray-100">
            {/* 배경 데코레이션 패브릭 느낌의 원형 */}
            <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-blue-600/5 rounded-full blur-3xl" />

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
                        { label: "사용자 등급", value: displayRole(parseInt(role)), highlight: true }
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
        </div>
    );
}