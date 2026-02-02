import { useState } from "react";

export default function ClassTest() {
  const [npcDialogue, setNpcDialogue] = useState<string>("");
  const handleDialogueChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNpcDialogue(e.target.value);
  };

  const [charaText, setCharaText] = useState<string>("");
  const handleCharaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCharaText(e.target.value);
  };

  return (
    <div>
      <header className="flex justify-between items-center px-6 py-4">
        <a href="" className="font-bold text-lg">Logo</a>
        <div className="flex gap-4">
          <a href="" className="text-sm">로그인</a>
          <a href="" className="text-sm">회원가입</a>
        </div>
      </header>

      <div className="w-[1000px] grid justify-start items-center gap-5 mx-auto">
        {/* 강의명 */}
        <div className="w-[1000px]">
          <h3 className="mb-2 font-semibold">강의명</h3>
          <input
            className="w-full h-10 px-5 text-[18px] border border-[#aaa] rounded box-border"
          />
        </div>

        {/* 테스트 정보 */}
        <div className="w-[1000px]">
          <h3 className="mb-2 font-semibold">테스트 정보</h3>

          <div className="flex justify-around items-center border border-[#aaa] rounded p-5">
            <div>
              <label className="mr-2 font-medium">교수 성함</label>
              <input
                readOnly
                placeholder="성함"
                className="w-20 h-[22px] border-none outline-none"
              />
            </div>

            <div>
              <label className="mr-2 font-medium">분야</label>
              <select className="w-[100px] h-[30px] rounded">
                <option>영어</option>
                <option>일본어</option>
                <option>중국어</option>
                <option>독일어</option>
                <option>이탈리아어</option>
              </select>
            </div>

            <div>
              <label className="mr-2 font-medium">국가</label>
              <select className="w-[100px] h-[30px] rounded">
                <option>미국</option>
                <option>영국</option>
                <option>일본</option>
                <option>중국</option>
                <option>독일</option>
                <option>이탈리아</option>
              </select>
            </div>

            <div>
              <label className="mr-2 font-medium">장소</label>
              <select className="w-[100px] h-[30px] rounded">
                <option>편의점</option>
                <option>카페</option>
                <option>대중교통</option>
                <option>항공</option>
                <option>호텔</option>
                <option>시장</option>
                <option>레스토랑</option>
                <option>학교</option>
              </select>
            </div>

            <div>
              <label className="mr-2 font-medium">난이도</label>
              <select className="w-[100px] h-[30px] rounded">
                <option>초급</option>
                <option>중급</option>
                <option>고급</option>
              </select>
            </div>
          </div>
        </div>

        <NpcPreview text={npcDialogue} />
        <CharaPreview text={charaText} />

        <div>
          <NpcInput value={npcDialogue} onChange={handleDialogueChange} />
          <CharaInput value={charaText} onChange={handleCharaChange} />

          <div className="w-[1000px]" />

          {/* 답 목록 */}
          <div className="w-[1000px]">
            <h3 className="mb-2 font-semibold">답 목록</h3>
            <div className="w-[1000px] flex items-center border-y-2 border-y-[#004d80] px-2 py-5">
              <WordListGenerator />
            </div>
          </div>

          {/* 정답 */}
          <div className="w-[1000px]">
            <h3 className="mb-2 font-semibold">정답</h3>
            <textarea
              className="w-full min-h-[100px] p-2.5 border border-[#aaa] rounded resize-none leading-relaxed"
            />
          </div>
        </div>

        <div className="w-[1000px]">
          <CreatableExaple />
        </div>

        {/* 버튼 */}
        <div className="flex justify-end items-center gap-5 mb-[30px] w-[1000px]">
          <button
            className="w-[70px] h-[35px] bg-[#004d80] text-white font-medium rounded
                       hover:bg-[#00324e]"
          >
            업로드
          </button>
          <button
            className="w-[70px] h-[35px] bg-red-500 text-white font-medium rounded
                       hover:bg-red-700"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
