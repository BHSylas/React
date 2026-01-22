import { useEffect, useState } from "react";
import PlayerCard from "./PlayerCard";
import { fetchAllPlayers } from "../../api/PlayerApi";
import { type Player } from "../../types/Player";

export default function PlayerGrid() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchAllPlayers()
      .then((data) => {
        setPlayers(data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center text-base-content/60">불러오는 중...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {players.map((player) => (
        <PlayerCard
          key={player.id}
          id={player.id}
          name={player.name}
          age={player.body}
          desc={player.type}
          media={player.mediaUrl}
          // [중요] PlayerCard에 age 값을 전달합니다.
        />
      ))}
    </div>
  );
}
