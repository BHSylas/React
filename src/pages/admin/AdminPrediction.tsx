import { useEffect, useState } from "react";
import { api } from "../../api/axiosInstance";
import { type MatchDto } from "../../types/MatchDto";
import AdminMatchCard from "../../components/predictions/AdminMatchCard";
import { useNavigate } from "react-router-dom";

export default function AdminPrediction() {
  const [matches, setMatches] = useState<MatchDto[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    api.get("/predictions/matches/admin")
      .then((res) => setMatches(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">불러오는 중...</div>;
  
  return (
    <div className="w-full max-w-5xl bg-base-200 mx-auto p-4 space-y-4 rounded-xl">
      <div className="flex flex-row">
        <h1 className="mx-2 mt-1 text-2xl font-bold">매치 관리</h1>
      </div>
      {matches.length === 0 && (
        <p className="text-base-content/60">매치 없음: 서버 관리자에게 문의하십시오.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <button className="btn btn-secondary bg-base-200 my-4" onClick={() => {navigate('/admin/predictions/new')}}>+ 새 매치</button>
        {matches.map((match) => (
          <AdminMatchCard key={match.id} match={match} interactive={true}/>
        ))}
      </div>
    </div>
  );
}
