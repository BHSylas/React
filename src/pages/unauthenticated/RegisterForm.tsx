import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const {login} = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await axios.post("/api/auth/register", { username, password });
      setSuccess("회원가입이 완료되었습니다!");
      const res = await axios.post("/api/auth/login", { username, password });
      const token = res.data.token;
      if (token) {
        login(token, username, null, res.data.point);
        navigate("/");
      }
      else {
        navigate("/login");
      }
      setTimeout(() => navigate("/login"), 500);
    } catch (err : any) {
      if (err.response?.status === 400) {
        setError(err.response.data.message || "이미 존재하는 사용자명입니다.");
      } else {
        setError("회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="max-w-sm mx-auto card bg-base-200 shadow-xl p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4">회원가입</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input input-bordered w-full"
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input input-bordered w-full"
          required
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input input-bordered w-full"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <button type="submit" className="btn btn-primary w-full bg-base-100">
          회원가입
        </button>
        <button
          type="button"
          className="btn btn-outline w-full bg-base-100"
          onClick={() => navigate("/login")}
        >
          로그인으로 돌아가기
        </button>
      </form>
    </div>
  );
}
