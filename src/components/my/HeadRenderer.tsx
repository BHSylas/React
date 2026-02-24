import { useAuth } from "../../hooks/useAuth";
import displayRole from "../../utils/displayRole";

export default function HeadRenderer() {
    const { name, nickname, role } = useAuth();
    if (!name || !nickname || !role) {
        return <div className="p-6">사용자 정보를 불러오는 중...</div>;
    }
    return (
        <div className="flex w-full h-48 p-8 pb-0 border-b border-gray-100">
            <div className="flex w-full gap-8">
                <h1 className="text-3xl font-bold">내 정보</h1>
                <div className="space-y-1.5 mt-1">
                    <div className="flex items-center gap-4">
                        <span className="w-16 font-bold text-blue-800 tracking-wider">이름</span>
                        <p className="text-lg font-semibold text-gray-800">{name}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="w-16 font-bold text-blue-800 tracking-wider">닉네임</span>
                        <p className="text-lg font-semibold text-gray-800">{nickname}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="w-16 font-bold text-blue-800 tracking-wider">등급</span>
                        <p className="text-lg font-semibold text-gray-800">{displayRole(parseInt(role))}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}