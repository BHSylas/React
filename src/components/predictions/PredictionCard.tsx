import { type MatchDto } from "../../types/MatchDto";
import { api } from "../../api/axiosInstance"; 
import { useRef, useState } from "react";

export default function PredictionCard({ match, interactive = true }: { match: MatchDto, interactive : boolean }) {
  const percent = (kid: number, mom: number, full: boolean = false) => {
    if(mom + kid === 0 && full) return 100;
    else if(mom + kid === 0) return 0;
    else return Math.round(100 * kid / (kid + mom));
  }
  const getPrevTeam = (raw : string) => {
    switch(raw) {
      case "HOME_WIN":
        return match.teamA;
        break;
      case "AWAY_WIN":
        return match.teamB;
        break;
      default:
        return "";
        break;
    }
  }
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(match.alreadyPredicted);
  const [prev, setPrev] = useState(match.yourPrevResult);
  const [homePercent, setHomePercent] = useState(percent(match.homeAmount, match.awayAmount));
  const [awayPercent, setAwayPercent] = useState(percent(match.awayAmount, match.homeAmount));
  const prevBet = useRef(match.yourPrevBet);
  const [bet, setBet] = useState(1);
  const date = new Date(new Date(match.matchDate).getTime() + (9 * 60 * 60 * 1000)); 
  const handlePredict = async ( result : "HOME_WIN" | "AWAY_WIN") => {
    if (loading || (result === prev && bet === prevBet.current)) return;
    setLoading(true);
    try {
      const res = await api.post<MatchDto>("/predictions", {
        matchId: match.id,
        predictedResult: result,
        bet: bet,
      });
      setDone(true);
      setHomePercent(percent(res.data.homeAmount, res.data.awayAmount, true));
      setAwayPercent(percent(res.data.awayAmount, res.data.homeAmount));
      prevBet.current = Math.min(bet, res.data.yourPrevBet);
      if(bet !== prevBet.current) {
        alert(`가진 포인트가 부족하여 최대치인 ${prevBet.current} 만큼만 참가되었습니다.`);
      }
      setPrev(result);
    } catch (e : any) {
      console.error(e);
      alert("예측 실패: " + e.message);
    } finally {
      setTimeout(() => setLoading(false), 150 + 100 * Math.random());
    }
  };
  return (
    <div className="card bg-base-100 shadow-lg p-5 border border-base-300 mt-4">
      <p className="text-base-content/60 text-xs text-center mt-1">{date.toLocaleString()}</p>
      <h1 className="text-xl font-bold text-center"><span className="text-3xl">{match.teamA}</span> vs. <span className="text-3xl">{match.teamB}</span></h1>
      <h2 className="text-sm font-bold text-center">{match.description ?? "Fight!"}</h2>
      <div className={interactive === true ? "flex w-full h-2 m-2 rounded" : "flex w-full m-2 rounded"}>
        <div className={prev === "HOME_WIN" ? "flex flex-1 text-green-400" : "flex flex-1"}>{homePercent} %</div>
        <div className={prev === "AWAY_WIN" ? "flex text-green-400" : "flex"}>{awayPercent} %</div>
      </div>
      <div className="flex w-full h-2 m-2 rounded overflow-hidden">
        <div className={homePercent >= awayPercent ? `bg-blue-700` : `bg-blue-400`} style={{ flexGrow: homePercent }}></div>
        <div className={homePercent > awayPercent ? "bg-red-400" : "bg-red-700"} style={{ flexGrow: awayPercent }}></div>
      </div>
      {done ? (
        <p className="text-green-400 font-semibold m-3 text-center">
          ✔ 예측한 경기({getPrevTeam(prev)}, {prevBet.current} 포인트)
        </p>
      ) : 
      <p className="font-semibold m-3 text-center">
          &nbsp;
        </p>}
      {!match.predictionOpen || !(date > new Date()) ? (
        <p className="text-red-500 font-semibold mt-3">
          ❌ 예측 마감
        </p>
      ) : (
        <div>
          {interactive ? (loading ? <div className="text-center w-full">처리 중...</div> : 
          <div className="flex flex-col">
            <p className="text-xs">포인트로 참가하기</p>
            <input className="m-2 input input-bordered" value={bet} onChange={(e) => {
              const n = parseInt(e.target.value);
              if(isNaN(n)) setBet(1);
              else setBet(n);
              }}></input>
            <div className="grid grid-cols-2 gap-4">
              <button
                className={`btn btn-primary md:btn-neutral md:hover:btn-primary hover:scale-105 transition-all text-xs font-semibold bg-base-200 w-full`}
                disabled={loading}
                onClick={() => handlePredict("HOME_WIN")}
              >
                {match.teamA} 승리
              </button>
              <button
                className="btn btn-error md:btn-neutral md:hover:btn-error hover:scale-105 transition-all text-xs font-semibold bg-base-200 w-full"
                disabled={loading}
                onClick={() => handlePredict("AWAY_WIN")}
              >
                {match.teamB} 승리
              </button>
            </div>
          </div>
          ) : <div></div>}
        </div>
      )}
    </div>
  );
}