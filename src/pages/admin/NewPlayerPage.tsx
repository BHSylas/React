import { useState, } from "react";
import { api } from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

interface AwardGroup {
  title: string;
  items: string[];
}

export default function ProfileCreatePage() {
  const navigate = useNavigate();

  // 기본 정보 입력
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [team, setTeam] = useState("");
  const [type, setType] = useState("");

  // AwardGroup 구조
  const [awards, setAwards] = useState<AwardGroup[]>([]);
  const [awardInput, setAwardInput] = useState<Record<number, string>>({});

  // 이미지 처리
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // AwardGroup → flattened string[] 변환
  function flattenAwards(groups: AwardGroup[]): string[] {
    const result: string[] = [];

    for (const g of groups) {
      result.push(`────${g.title}────`);
      for (const item of g.items) result.push(item);
      result.push(""); // 시각적 구분용
    }

    return result;
  }

  // AwardGroup 관리
  const addGroup = () => {
    setAwards((prev) => [...prev, { title: "", items: [] }]);
  };

  const removeGroup = (idx: number) => {
    setAwards((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateGroupTitle = (idx: number, title: string) => {
    setAwards((prev) => {
      const clone = [...prev];
      clone[idx].title = title;
      return clone;
    });
  };

  const addAwardItem = (gIdx: number) => {
  const text = awardInput[gIdx]?.trim();
  if (!text) return;

  setAwards((prev) => {
    const clone = [...prev]; // awards 복사

    const group = { ...clone[gIdx] };        // 그룹 복사
    const itemsCopy = [...group.items];      // items 배열도 복사
    itemsCopy.push(text);

    group.items = itemsCopy;
    clone[gIdx] = group;

    return clone;
  });

  setAwardInput((prev) => ({ ...prev, [gIdx]: "" }));
};

  const removeAwardItem = (gIdx: number, iIdx: number) => {
    setAwards((prev) => {
      const clone = [...prev];
      clone[gIdx].items = clone[gIdx].items.filter((_, i) => i !== iIdx);
      return clone;
    });
  };

  // 이미지 처리
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  // 제출
  const submit = async () => {
    try {
      setLoading(true);
      setMessage("");

      const flattenedAwards = flattenAwards(awards);

      const formData = new FormData();
      formData.append("player", new Blob([JSON.stringify({
        name: name,
        body: body,
        type: type,
        team: team,
        awards: flattenedAwards,
      })], { type: "application/json" }));
      if (file) {
        console.log(file);
        formData.append("media", file);
    }
      await api.post("/players", formData);
      setMessage("프로필이 등록되었습니다!");
      navigate(`/admin/players`); // 필요 시 활성화

    } catch (err) {
      console.error(err);
      setMessage("등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">프로필 생성</h1>

      {/* NAME */}
      <div className="form-control">
        <label className="label m-2 ml-0">이름</label>
        <input
          className="input input-bordered"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* BIO */}
      <div className="form-control">
        <label className="label m-2 ml-0">생년월일(YYYY년 MM월 DD일)</label>
        <input
          className="input input-bordered"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      {/* SPORTS */}
      <div className="form-control">
        <label className="label m-2 ml-0">경력</label>
        <input
          className="input input-bordered"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
      </div>

      {/* TEAM */}
      <div className="form-control">
        <label className="label m-2 ml-0">종목</label>
        <input
          className="input input-bordered"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
        />
      </div>

      {/* AWARDS */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="label m-2 ml-0">수상 경력</label>
          <button className="btn btn-sm p-2" onClick={addGroup}>
            + 대회 추가
          </button>
        </div>

        {awards.map((group, gIdx) => (
          <div key={gIdx} className="border p-4 rounded-lg space-y-3">
            {/* 그룹 타이틀 */}
            <div className="flex justify-between items-center">
              <input
                className="input input-bordered flex-1"
                placeholder="대회 이름 입력 (예: 아시아 선수권)"
                value={group.title}
                onChange={(e) => updateGroupTitle(gIdx, e.target.value)}
              />
              <button
                className="btn btn-sm btn-error ml-2 p-2"
                onClick={() => removeGroup(gIdx)}
              >
                삭제
              </button>
            </div>

            {/* 아이템 리스트 */}
            <div className="space-y-2">
              {group.items.map((item, iIdx) => (
                <div
                  key={iIdx}
                  className="flex justify-between items-center bg-base-200 p-2 rounded"
                >
                  <span>{item}</span>
                  <button
                    className="p-1 font-bold"
                    onClick={() => removeAwardItem(gIdx, iIdx)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            {/* 아이템 추가 */}
            <div className="flex gap-2">
              <input
                className="input input-bordered flex-1"
                placeholder="경력 입력"
                value={awardInput[gIdx] || ""}
                onChange={(e) =>
                  setAwardInput((prev) => ({
                    ...prev,
                    [gIdx]: e.target.value,
                  }))
                }
              />
              <button
                className="btn btn-sm p-2"
                onClick={() => addAwardItem(gIdx)}
              >
                추가
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* IMAGE */}
      <div className="form-control">
        <label className="label m-2 ml-0">프로필 이미지</label>
        <input type="file" className="file-input m-2" onChange={onFileChange} />
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-40 h-40 object-cover mt-2 rounded shadow"
          />
        )}
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
