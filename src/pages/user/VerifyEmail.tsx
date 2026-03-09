// import axios from "axios";
// import { useEffect, useState, useRef } from "react";
// import { useNavigate, useSearchParams } from "react-router";

// export default function VerifyEmail() {
//     const [searchParam] = useSearchParams();
//     const navigate = useNavigate();
//     const [status, setStatus] = useState("processing"); // 아직 인증이 되지 않았을 때
//     const [message, setMessage] = useState("이메일 인증을 처리 중 입니다...");

//     const token = searchParam.get("token");
//     const isCalled = useRef(false);

//     useEffect(() => {
//         if (isCalled.current || !token) return;

//         const verifyToken = async () => {
//             isCalled.current = true;

//             try {
//                 const response = await axios.get(`/api/auth/verify-email?token=${token}`);

//                 if (response.status === 200) {
//                     setStatus("success");
//                     setMessage("이메일 인증이 완료되었습니다! 잠시 후 메인으로 이동합니다.");

//                     // 2초 뒤 메인으로 이동
//                     setTimeout(() => {
//                         navigate("/");
//                     }, 2000);
//                 }

//             } catch (e: any) {
//                 setStatus("error");
//                 setMessage(e.response?.data?.message || "인증에 실패했습니다. 만료된 토큰이거나 이미 인증된 계정일 수 있습니다.");
//             }
//         };
//         verifyToken();
//     }, [token, navigate]);

//     return (
//         <div>
//             {status === "processing" && (
//                 <div className="flex flex-col items-center">
//                     <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
//                     <p className="text-gray-600 font-medium">{message}</p>
//                 </div>
//             )}

//             {status === "success" && (
//                 <div>
//                     <h2 className="text-2xl font-black text-gray-900 mb-2">인증 성공!</h2>
//                     <p className="text-blue-600 font-bold">{message}</p>
//                 </div>
//             )}

//             {status === "error" && (
//                 <div>
//                     <h2 className="text-2xl font-black text-gray-900 mb-2">인증 실패</h2>
//                     <p className="text-red-500 font-bold mb-6">{message}</p>
//                     <button
//                         onClick={() => navigate("/")}
//                         className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all"
//                     >
//                         홈으로 돌아가기
//                     </button>
//                 </div>
//             )}
//         </div>
//     )
// }