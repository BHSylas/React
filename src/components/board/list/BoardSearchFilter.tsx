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
    <div className="flex gap-2">
      <select className="border rounded px-2 py-1 text-sm"
        value={category}
        onChange={(e) => setCategory(e.target.value)}>
        <option value="title">제목</option>
        <option value="writerName">작성자</option>
      </select>

      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="검색어를 입력하세요"
        className="border rounded px-2 py-1 text-sm flex-1"
      />

      <button
        type="button"
        className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
        onClick={() =>
          handleSearch}
      >
        검색
      </button>
    </div>
  );
}
