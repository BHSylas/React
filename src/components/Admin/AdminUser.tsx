import { useState, useCallback, useEffect } from "react";
import { api } from "../../api/axiosInstance";
import { UserDetailModal } from "./UserDetailModal";

interface AdminUserDTO {
    userId: number;
    email: string;
    name: string
    nickname: string;
    roleCode: number;
    roleName: string;
    status: string;
    createdAt: string;
}

interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
}

export function AdminUserList() {
    const [data, setData] = useState<PageResponse<AdminUserDTO> | null>(null);
    const [keyword, setKeyword] = useState<string>('');
    const [searchInput, setSearchInput] = useState<string>('');
    const [page, setPage] = useState<number>(0);
    const [loading, setLoding] = useState<boolean>(false);

    const [selectedUser, setSelectedUser] = useState<AdminUserDTO | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoding(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                size: '20',
            });
            if (keyword) params.append('keyword', keyword);

            const response = await api.get<PageResponse<AdminUserDTO>>(`/admin/users?${params.toString()}`);
            setData(response.data);
        } catch (error) {
            console.error("사용자 목록 로드 실패:", error);
        } finally {
            setLoding(false);
        }
    }, [page, keyword]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setKeyword(searchInput);
        setPage(0);
    }
    
    return (
        <div className="p-8 min-h-screen text-gray-800">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">사용자 관리</h2>
                    <p className="text-gray-500 mt-1">
                        전체 사용자 <span className="text-blue-600 font-bold">{data?.totalElements.toLocaleString() || 0}</span>명
                    </p>
                </div>

                {/* 검색 바 */}
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        className="px-4 py-2 w-64 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                        placeholder="닉네임, 이메일 검색"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <button type="submit" className="bg-gray-800 hover:bg-black text-white px-5 py-2 rounded-lg text-sm font-bold transition">
                        조회
                    </button>
                </form>
            </div>

            {/* 테이블 카드 영역 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest border-b border-gray-200">
                                <th className="px-6 py-4 font-bold text-center">ID</th>
                                <th className="px-6 py-4 font-bold">사용자 정보</th>
                                <th className="px-6 py-4 font-bold">권한</th>
                                <th className="px-6 py-4 font-bold text-center">상태</th>
                                <th className="px-6 py-4 font-bold text-right">가입일</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-medium">데이터 로딩 중...</td>
                                </tr>
                            ) : data?.content.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-gray-400">검색 결과가 없습니다.</td>
                                </tr>
                            ) : (
                                data?.content.map((user) => (
                                    <tr key={user.userId} 
                                    onClick={() => setSelectedUser(user)}
                                    className="hover:bg-gray-50 transition-colors cursor-pointer">
                                        <td className="px-6 py-4 text-gray-500 text-center">{user.userId}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900">
                                                    {user.nickname} <span className="text-gray-400 text-xs font-normal ml-1">({user.name})</span>
                                                </span>
                                                <span className="text-xs text-gray-500">{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 font-medium text-xs">
                                                {user.roleName}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${user.status === 'ACTIVE'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {data && data.totalPages > 0 && (
                    <div className="flex justify-center items-center py-6 border-t border-gray-100 gap-5">
                        <button
                            onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                            disabled={page === 0}
                            className="px-3 py-1 border border-gray-300 text-gray-500 rounded hover:bg-gray-100"
                        >
                            이전
                        </button>

                        <div className="flex gap-4">
                            {[...Array(data.totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i)}
                                    className={`${page === i ? 'text-blue-500 font-bold' :
                                    'text-gray-500 hover:font-bold'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setPage(prev => Math.min(prev + 1, data.totalPages - 1))}
                            disabled={page + 1 >= data.totalPages}
                            className="px-3 py-1 border border-gray-300 text-gray-500 rounded hover:bg-gray-100"
                        >
                            다음
                        </button>
                    </div>
                )}
            </div>
            {selectedUser && (
                <UserDetailModal
                user={selectedUser}
                onClose={() => setSelectedUser(null)}
                onUpdate={() => {fetchUsers();
                    setSelectedUser(null)
                }} />
            )}
        </div>
    );
}