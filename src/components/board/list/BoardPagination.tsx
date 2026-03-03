interface PaginationProps {
    currentPage: number; // 현재 페이지
    totalPages: number; // 보여지는 총 페이지 수
    onPageChange: (page: number) => void; // 페이지 넘길 때
}

export function BoardPagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    return (
        <div className="flex justify-center items-center gap-3 mt-8">
            {/* 이전 버튼 */}
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="p-1 text-gray-300 hover:text-gray-900 disabled:opacity-0 disabled:cursor-default transition-colors"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>

            {/* 페이지 번호 */}
            <div className="flex items-center gap-4">
                {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = currentPage === pageNum;

                    return (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={`relative py-1 text-[14px] transition-all
                                ${isActive
                                    ? "text-gray-900 font-bold"
                                    : "text-gray-400 hover:text-gray-600 font-medium"
                                }`}
                        >
                            {pageNum}
                        </button>
                    );
                })}
            </div>

            {/* 다음 버튼 */}
            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="p-1 text-gray-300 hover:text-gray-900 disabled:opacity-0 disabled:cursor-default transition-colors"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
        </div>
    );
}