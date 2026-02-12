import { useNavigate } from "react-router-dom";
import { decompileCountryCode } from "../../utils/decompileCountryCode";
import type { EnrollmentItem } from "../../types/EnrollmentItem";

export default function EnrollmentRenderer({ classes }: { classes: EnrollmentItem[] }) {
    const navigate = useNavigate();
    if(classes.length === 0) {
        return <div className="text-center py-10">수강 중인 강의가 없습니다.</div>;
    }
    return (
        <div className="flex-1 px-8">
            <h2 className="text-4xl font-bold mb-8">내 강의</h2>
            <div className="flex flex-col gap-8">
                {classes.map((enrollment) => (
                    <div 
                    key={enrollment.lectureId} 
                    className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow" 
                    onClick={() => {navigate(`/class/${enrollment.lectureId}`)}}>
                        <h3 className="text-2xl font-bold mb-4">{enrollment.title}</h3>
                        <p className="text-sm text-gray-400">{decompileCountryCode(enrollment.language)} · {enrollment.professorNickname} · {enrollment.country}</p>
                        <p className="text-gray-600 mb-2">{enrollment.progressRate}%</p>
                        <div className="flex w-full h-2 rounded overflow-hidden bg-gray-300">
                            <div className="bg-green-500" style={{ flexGrow: enrollment.progressRate / 100 }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}