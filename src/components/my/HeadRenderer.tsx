import { useAuth } from "../../hooks/useAuth";

export default function HeadRenderer() {
    const {name, nickname, role} = useAuth();
    if(!name || !nickname || !role) {
        return <div className="p-6">사용자 정보를 불러오는 중...</div>;
    }
  return (
    <div className="flex w-full h-48 p-8 pb-0">
        <div className="flex w-full gap-8">
            <h1 className="text-3xl font-bold">내 정보</h1>
            <div className="">
                <p className="text-lg">이름: {name}</p>
                <p className="text-lg">닉네임: {nickname}</p>
                <p className="text-lg">역할: {role}</p>
            </div>
        </div>
    </div>
  );
}