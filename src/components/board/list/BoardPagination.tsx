interface PaginationProps {
    currentPage: number; // 현재 페이지
    totalPages: number; // 보여지는 총 페이지 수
    onPageChange: (page: number) => void; // 페이지 넘길 때
}

export function BoardPagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    return (
        <div className="flex justify-center items-center gap-2 mt-6">
            <button disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="text-gray-400 text-lg cursor-pointer hover:text-gray-600">&lt;</button>
            {[...Array(totalPages)].map((_, i) => (
                <button key={i + 1}
                    onClick={() => onPageChange(i + 1)}
                    className={`text-sm px-1 ${currentPage === i + 1
                            ? "font-bold text-gray-600"
                            : "hover:text-gray-400"
                        }`}>{i + 1}</button>
            ))}
            <button disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="text-gray-400 text-lg cursor-pointer hover:text-gray-600">&gt;</button>
        </div>
    );
}