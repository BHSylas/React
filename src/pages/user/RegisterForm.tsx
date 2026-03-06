import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { api } from "../../api/axiosInstance";
import axios from "axios";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  const navigate = useNavigate();

  // 영어, 숫자, 특수문자 포함 / 8~16자
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
  // 위의 조건과 맞지 않는 비밀번호
  const isPasswordValid = passwordRegex.test(password);
  // 비밀번호와 비밀번호 확인이 동일하지 않음
  const isPasswordMatch = password === confirmPassword && confirmPassword !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isPasswordValid) return; // 유효하지 않으면 제출 방지
    if (!isPasswordMatch) return; // 이하동문

    setIsLoading(true); // 로딩 시작
    try {
      const response = await axios.post("/api/auth/signup", {
        email,
        password,
        name,
        nickname,
      });

      if (response.status === 200 || response.status === 201) {
        alert("회원가입이 완료되었습니다. 이메일 인증 후 로그인해주세요.");
        navigate("/");
      }

    } catch (err: any) {
      console.error("회원가입 실패 로그:", err);

      const status = err.response?.status;
      const serverMessage = err.response?.data?.message;

      if (status === 409) {
        setError("이미 가입된 동일한 이메일이 존재합니다.");
      } else if (status === 400) {
        setError(serverMessage || "입력 형식을 다시 확인해주세요.");
      } else {
        setError(serverMessage || "회원가입 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = "w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-sm font-medium placeholder:text-blue-500";

  return (
    <div className="max-w-[400px] mx-auto bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-10 mt-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-8 text-center">
        <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Join Us</p>
        <h2 className="text-3xl font-black text-gray-900 tracking-tighter">회원가입</h2>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputStyle}
            required
          />
        </div>
        <div className="space-y-1">
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputStyle}
            required
          />
        </div>
        <div className="space-y-1">
          <input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className={inputStyle}
            required
          />
        </div>
        <div className="space-y-1">
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputStyle}
            required
          />
          {password && !isPasswordValid && (
            <p className="text-red-500 text-[13px] font-bold ml-2">
              * 영문, 숫자, 특수문자 포함 8~16자로 입력해주세요.
            </p>
          )}

        </div>
        <div className="space-y-1">
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputStyle}
            required
          />
          {confirmPassword && !isPasswordMatch && (
            <p className="text-red-500 text-[13px] font-bold ml-2">
              * 비밀번호가 일치하지 않습니다.
            </p>
          )}
        </div>

        {error && (
          <p className="text-red-500 text-[13px] font-bold ml-1">
            {error}
          </p>
        )}

        <div className="pt-4 space-y-3">
          <button
            type="submit"
            className="w-full py-4 bg-blue-600 text-white text-[15px] font-black rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95 transition-all"
          >
            {isLoading ? "처리 중..." : "회원가입"}
          </button>
        </div>
      </form>
    </div>
  );
}
