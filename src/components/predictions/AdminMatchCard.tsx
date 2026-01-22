import { type MatchDto } from "../../types/MatchDto";
import { api } from "../../api/axiosInstance"; 
import { useEffect, useRef, useState } from "react";

export default function AdminMatchCard({ match, interactive = true }: { match: MatchDto, interactive : boolean }) {
  const [hidden, setHidden] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [predictable, setPredictable] = useState(match.predictionOpen);
  const [date, setDate] = useState(new Date(new Date(match.matchDate).getTime() + (9 * 60 * 60 * 1000))); 
  const endPrediction = async(matchId: number) => {
    try {
        await api.put("/match", {
            id: matchId,
            predictionOpen: true,
            result: "NONE",
            matchDate: new Date().toISOString(), // 한국 시간 맞추기
        });
        setRefresh(true);
    }
    catch (e : any) {
        console.error(e);
        alert("예측 종료 실패: " + e.message);
    }
  };
  const closingMatch = async(matchId: number, result: "HOME_WIN" | "AWAY_WIN") => {
    try {
        await api.put("/match", {
            id: matchId,
            predictionOpen: false,
            result: result,
            matchDate: new Date().toISOString(), // 한국 시간 맞추기
        });
          setRefresh(true);
          setPredictable(false);
    }
    catch (e : any) {
        console.error(e);
        alert("결산 실패: " + e.message);
    }
  };
  const removeMatch = async(matchId: number) => {
    if(!confirm("정말로 이 경기를 삭제하시겠습니까? 삭제된 경기는 복구할 수 없습니다.")) return;
    try {
        await api.delete("/match", {
            data: { id: matchId }
        });
        setRefresh(true);
        setHidden(true);
    }
    catch (e : any) {
        console.error(e);
        alert("경기 삭제 실패: " + e.message);
    }
  };
  useEffect(() => {
    if(refresh === false) return;
    setDate(new Date());
    setRefresh(false);
  }, [refresh]);
  const percent = (kid: number, mom: number, full: boolean = false) => {
    if(mom + kid === 0 && full) return 100;
    else if(mom + kid === 0) return 0;
    else return Math.round(100 * kid / (kid + mom));
  }
  const homePercent = useRef(percent(match.homeAmount, match.awayAmount));
  const awayPercent = useRef(percent(match.awayAmount, match.homeAmount));
  if(hidden === true) return null;
  return (
    <div className="card bg-base-100 shadow-lg p-5 border border-base-300 mt-4">
      <p className="text-base-content/60 text-xs text-center mt-1">{date.toLocaleString()}</p>
      <h1 className="text-xl font-bold text-center">{match.teamA} vs. {match.teamB}</h1>
      <h2 className="text-sm font-bold text-center">{match.description ?? "Fight!"}</h2>
      {date <= new Date() && <p className="text-red-700 font-bold text-center">이미 시작된 경기</p>}
      {predictable === false && <p className="text-red-700 font-bold text-center">결산된 경기</p>}
      <div className={interactive === true ? "flex w-full h-2 m-2 rounded" : "flex w-full m-2 rounded"}>
        <div className={"flex flex-1"}>{homePercent.current} %</div>
        <div className={"flex"}>{awayPercent.current} %</div>
      </div>
      <div className="flex w-full h-2 m-2 rounded overflow-hidden">
        <div className={homePercent.current >= awayPercent.current ? `bg-blue-700` : `bg-blue-400`} style={{ flexGrow: homePercent.current }}></div>
        <div className={homePercent.current > awayPercent.current ? "bg-red-400" : "bg-red-700"} style={{ flexGrow: awayPercent.current }}></div>
      </div>
      <div className="flex justify-center items-center">
        {interactive === true ? (
          (predictable === true && date <= new Date()) ? (
            <div className="flex">
              <button className="btn btn-primary font-semibold m-3 text-center p-4" onClick={() => {closingMatch(match.id, "HOME_WIN")}}>{match.teamA} 승리</button>
              <button className="btn btn-error font-semibold m-3 text-center p-4" onClick={() => {closingMatch(match.id, "AWAY_WIN")}}>{match.teamB} 승리</button>
            </div>
          ) : (
            predictable === true ?
                <div className="btn font-semibold m-3 text-center" onClick={() => {endPrediction(match.id)}}>예측 종료하기</div>
                : <div className="font-semibold m-3 text-center">결산됨</div>
          )
        ) : <div></div>}
      </div>
        {interactive === true ? (
          <button className="btn btn-error justify-center items-center" onClick={() => {removeMatch(match.id)}}>
            경기 삭제하기
          </button>
        ) : <div></div>}
    </div>
  );
}