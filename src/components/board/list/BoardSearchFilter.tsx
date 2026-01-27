interface BoardSearchFilterProps {
  onSearch: (params: { keyword: string; category: string }) => void;
}

export function BoardSearchFilter({ onSearch }: BoardSearchFilterProps) {
  return (
    <div className="flex gap-2">
      <select className="border rounded px-2 py-1 text-sm">
        <option value="title">제목</option>
        <option value="author">작성자</option>
      </select>

      <input
        type="text"
        placeholder="검색어를 입력하세요"
        className="border rounded px-2 py-1 text-sm flex-1"
      />

      <button
        type="button"
        className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
        onClick={() =>
          onSearch({ keyword: "", category: "title" })
        }
      >
        검색
      </button>
    </div>
  );
}
