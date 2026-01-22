import { useNavigate } from "react-router-dom";

interface PlayerCardProps {
  id: number;
  age: string;
  name: string;
  desc: string;
  media: string | null;
}

export default function PlayerCard({ id, name, age, desc, media }: PlayerCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="card bg-base-200 shadow-xl cursor-pointer hover:shadow-2xl transition overflow-hidden hover:scale-105" 
      onClick={() => navigate(`/players/${id}`)}
    >
      {/* 이미지 영역 */}
      <figure className="w-full h-80">
        {media ? (
          <img 
            src={media} 
            alt={name} 
            className="w-full h-full object-cover object-top" 
          />
        ) : (
          <div className="w-full h-full bg-base-300 flex items-center justify-center">
            이미지 없음
          </div>
        )}
      </figure>

      <div className="card-body p-6 text-center">
        <h2 className="text-xl font-bold">
          {name}
        </h2>

        {/* [수정] 여기에 age(나이)를 추가해 주세요 */}
        <p>{age}</p>
        <div className="divider my-2"></div>

        <p className="text-lg font-semibold text-base-content/80">
          {desc}
        </p>
      </div>
    </div>
  );
}