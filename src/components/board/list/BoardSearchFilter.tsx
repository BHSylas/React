import { useState } from "react";

interface BoardSearchFilterProps {
  onSearch: (params: { keyword: string; category: string }) => void;
}

export function BoardSearchFilter({ onSearch }: BoardSearchFilterProps) {

  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("title");

  const handleSearch = () => {
    onSearch({ keyword, category });
  };

  // 엔터키 반응
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    /* max-w-md를 제거하고 w-full을 적용하여 부모 컨테이너 너비에 맞게 꽉 채움 */
    <div className="flex items-center gap-0 bg-gray-100/60 p-1.5 rounded-xl w-full transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 focus-within:shadow-md">
      
      {/* 카테고리 선택 - 너비를 고정하여 안정감 부여 */}
      <select 
        className="bg-transparent pl-5 pr-3 py-2 text-sm font-semibold text-gray-600 focus:outline-none cursor-pointer appearance-none"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="title">제목</option>
        <option value="writerName">작성자</option>
      </select>

      {/* 수직 구분선 */}
      <div className="w-[1px] h-5 bg-gray-200 mx-2" />

      {/* 검색 입력창 - flex-1로 남은 공간 전체 차지 */}
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="검색어를 입력하여 필요한 정보를 찾아보세요."
        className="bg-transparent px-4 py-2 text-[15px] flex-1 focus:outline-none text-gray-700 placeholder:text-gray-400"
      />

      {/* 검색 버튼 - 텍스트와 아이콘을 함께 배치하여 너비감 확장 */}
      <button
        type="button"
        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow-sm active:scale-95"
        onClick={handleSearch}
      >
        <svg 
          width="16" height="16" viewBox="0 0 24 24" 
          fill="none" stroke="currentColor" strokeWidth="3" 
          strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <span className="text-sm font-bold">검색하기</span>
      </button>
    </div>
  );
}
