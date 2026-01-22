import { useEffect, useState } from "react";
import PlayerCard from "./PlayerCard";
import { fetchAllPlayers } from "../../api/PlayerApi";
import { type Player } from "../../types/Player";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axiosInstance";

export default function AdminGrid() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetchAllPlayers()
      .then((data) => {
        setPlayers(data);
      })
      .finally(() => setLoading(false));
  }, []);
  const handleRemoval = (id: number) => {
    const c = confirm("정말로 선수를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.");
    if (c) {
      api.delete(`/players/${id}`).then(() => {
        setPlayers((prev) => prev.filter((p) => p.id !== id));
      });
    }
  } 
  if (loading) {
    return <div className="text-center text-base-content/60">불러오는 중...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="btn btn-secondary bg-base-200" onClick={() => {navigate('/admin/players/new')}}>+ 새 선수</div>
      {players.map((player) => (
        <div className="flex flex-col" key={player.id}>
          <PlayerCard
            key={player.id}
            id={player.id}
            name={player.name}
            age={player.body}
            desc={player.type}
            media={player.mediaUrl}
            // [중요] PlayerCard에 age 값을 전달합니다.
          />
          <div className="flex flex-row mt-2">
            <button className="btn btn-sm btn-success bg-base-200 flex-1 m-1" onClick={() => {navigate(`/admin/players/edit/${player.id}`)}}>수정</button>
            <button className="btn btn-sm btn-error bg-base-200 flex-1 m-1" onClick={() => {handleRemoval(player.id)}}>삭제</button>
          </div>
        </div>
      ))}
    </div>
  );
}
