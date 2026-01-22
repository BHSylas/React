import { useState, } from "react";
import { api } from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';

export default function MatchCreatePage() {
  const navigate = useNavigate();

  const today = new Date();

  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 1);
  
  const maxDate = new Date(today);
  maxDate.setFullYear(today.getFullYear() + 1);
  // 기본 정보 입력
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [matchDate, setDate] = useState<Date | null>(minDate); // 현재 날짜로 초기화
  const [description, setDesc] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  // 제출
  const submit = async () => {
    try {
      setLoading(true);
      setMessage("");
      if(matchDate === null || teamA.trim() === "" || teamB.trim() === "") {
        setMessage("내용이 올바르게 작성되지 않았습니다.");
        setLoading(false);
        return;
      }
      await api.post("/match", {
        teamA: teamA,
        teamB: teamB,
        description: description,
        matchDate: matchDate.toISOString(),
      });
      setMessage("프로필이 등록되었습니다!");
      navigate(`/admin/predictions`); // 필요 시 활성화

    } catch (err) {
      console.error(err);
      setMessage("등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">매치 생성</h1>

      {/* NAME */}
      <div className="form-control">
        <label className="label m-2 ml-0">홈 팀</label>
        <input
          className="input input-bordered"
          value={teamA}
          placeholder="홈 팀 이름을 입력하세요"
          onChange={(e) => setTeamA(e.target.value)}
        />
      </div>

      {/* BIO */}
      <div className="form-control">
        <label className="label m-2 ml-0">어웨이 팀</label>
        <input
          className="input input-bordered"
          value={teamB}
          placeholder="어웨이 팀 이름을 입력하세요"
          onChange={(e) => setTeamB(e.target.value)}
        />
      </div>

      {/* SPORTS */}
      <div className="form-control">
        <label className="label m-2 ml-0">설명(선택)</label>
        <input
          className="input input-bordered"
          value={description}
          placeholder="매치 설명"
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>

      {/* TEAM */}
      <div className="form-control">
        <label className="label m-2 ml-0">경기 날짜</label>
        <DatePicker
          dateFormat='yyyy.MM.dd HH-mm' // 날짜 형태
          timeFormat='HH-mm' // 시간 형태
          showTimeSelect // 시간 선택 옵션 활성화
          shouldCloseOnSelect // 날짜를 선택하면 datepicker가 자동으로 닫힘
          minDate={minDate} // minDate 이전 날짜 선택 불가
          maxDate={maxDate} // maxDate 이후 날짜 선택 불가
          timeIntervals={10} // 시간 선택 간격 (분 단위)
          selected={matchDate ? new Date(matchDate) : null} // 현재 선택된 날짜
          onChange={(date) => {setDate(date)}}
        />
      </div>

      {/* SUBMIT */}
      <button
        className="btn btn-primary w-full"
        disabled={loading}
        onClick={submit}
      >
        {loading ? "업로드 중..." : "등록"}
      </button>

      {message && <div className="alert alert-info mt-4">{message}</div>}
    </div>
  );
}
