import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileSections from "../../components/profile/ProfileSections";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchPlayerById } from "../../api/PlayerApi";
import { type Player } from "../../types/Player";

export default function ProfilePage() {
  const { id } = useParams();
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    if (id) {
      fetchPlayerById(Number(id)).then(setPlayer);
    }
  }, [id]);

  if (!player) {
    return <div className="p-6">불러오는 중...</div>;
  }
  return (
    <main className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 p-4 lg:p-6">
      <div className="flex-1 space-y-6">
        {/* ⬇ 선수 데이터 props로 전달 */}
        <ProfileHeader player={player} />
        <ProfileSections player={player} />
      </div>
    </main>
  );
}
