import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { AdminStatsView } from "../../components/Admin/AdminStatsView";
import AdminLecture from "../../components/Admin/AdminLecture";

type AdminMenu = 'stats' | 'Lecture'

export default function AdminMainPage() {
    const role = useContext(AuthContext).role;
    const navigate = useNavigate();

    const [activeMenu, setActiveMenu] = useState<AdminMenu>('stats');

    // console.log(role);
    if (role === null) {
        console.log("No role, probably waiting for auth...");
        return <div>Loading...</div>;
    }
    else if (role !== '2') {
        alert("No exception!");
        navigate('/');
    }

    const renderContent = () => {
        switch (activeMenu) {
            case 'stats':
                return <AdminStatsView />
            case 'Lecture':
                return <AdminLecture />
            default:
                return <AdminStatsView />;
        }
    }

    return (
        <div className="min-h-screen">
            {/* 2. 상단 탭 내비게이션 태그 */}
            <div className="border-b shadow-sm">
                <div className="px-6">
                    <div className="flex space-x-8">
                        <button
                            onClick={() => setActiveMenu('stats')}
                            className={`py-4 px-1 font-bold text-sm transition-all border-b-2 
                                ${activeMenu === 'stats' ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            메타버스 통계
                        </button>

                        <button
                            onClick={() => setActiveMenu('Lecture')}
                            className={`py-4 px-1 font-bold text-sm transition-all border-b-2 
                                ${activeMenu ==='Lecture' ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            강의 관리
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. 실제 내용이 출력되는 영역 */}
            <main className="py-6">
                <div>
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}