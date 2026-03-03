import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axiosInstance";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await api.post("/auth/signup", {
        email,
        password,
        name,
        nickname,
      }).then((response) => {
        alert("회원가입이 완료되었습니다.");
        console.log("회원가입 성공:", response.data);
      });
      navigate("/");
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "회원가입 중 오류가 발생했습니다."
      );
    }
  };

  const inputStyle = "w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-sm font-medium placeholder:text-gray-300";

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
        </div>

        {error && (
          <p className="text-red-500 text-[13px] font-bold ml-1 animate-bounce">
            {error}
          </p>
        )}

        <div className="pt-4 space-y-3">
          <button
            type="submit"
            className="w-full py-4 bg-blue-600 text-white text-[15px] font-black rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95 transition-all"
          >
            시작하기
          </button>
        </div>
      </form>
    </div>
  );
}
