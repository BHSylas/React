import { useEffect, useState } from "react";
import { api } from "../../api/axiosInstance";
import PredictionCard from "../../components/predictions/PredictionCard";
import { type MatchDto } from "../../types/MatchDto";

export default function PredictionPage() {
  const [matches, setMatches] = useState<MatchDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAbout, setAbout] = useState(false);
  useEffect(() => {
    api.get("/predictions/matches")
      .then((res) => setMatches(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">불러오는 중...</div>;
  
  return (
    <div className="w-full max-w-5xl bg-base-200 mx-auto p-4 space-y-4 rounded-xl">
      <div className="flex flex-row">
        <h1 className="mx-2 mt-1 text-2xl font-bold">승부 예측</h1>
        <div className="btn mx-2 text-2xl font-bold bg-base-100" onClick={() => setAbout(showAbout !== true)}>?</div>
      </div>
      {showAbout === true && <div className=" position-absolute p-4 bg-base-100 rounded-lg border border-base-300">
        <p className="font-bold">이 페이지에서는 각 경기마다 승리할 팀을 예측하고 포인트를 걸어 보상을 받을 수 있습니다.</p>
        <p className="font-bold">예측하는 팀과 거는 포인트를 수정할 수 있으며, 포인트는 경기 종료 후에 계산됩니다.</p>
        <p className="font-bold">이미 결산된 투표는 이 페이지에서 확인하실 수 없습니다. 내 정보 페이지에서 결과를 확인해주세요.</p>
        <p className="font-bold">경기 시작 10분 전부터는 투표할 수 없게 되므로 유의하시기 바랍니다.</p>
        </div>}
      {matches.length === 0 && (
        <p className="text-base-content/60">예측 가능한 경기가 없습니다.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {matches.map((match) => (
          <PredictionCard key={match.id} match={match} interactive={match.predictionOpen === true && new Date(new Date(match.matchDate).getTime() + (9 * 60 * 60 * 1000)) > new Date()}/>
        ))}
      </div>
    </div>
  );
}
