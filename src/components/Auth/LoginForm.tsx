import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../api/axiosInstance";
import { AuthModalContext } from "../../context/AuthModalContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();
  const { close } = useContext(AuthModalContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("이메일을 입력해 주세요.");
      return;
    }
    if (!password) {
      setError("비밀번호를 입력해 주세요.");
      return;
    }

    setError("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { accessToken, userName, userNickname } = res.data;

      login({ token: accessToken, name: userName, nickname: userNickname });
      close();                // Modal 닫기 (선택)
      window.location.reload(); // ⭐ 핵심
    } catch (err) {
      console.error(err);
      setError("로그인에 실패했습니다. 정보를 확인해 주세요.");
    }
  };

  return (
    <div className="max-w-sm mx-auto card bg-base-200 p-6">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">로그인</h2>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered w-full"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input input-bordered w-full"
        />
        <button type="submit" className="btn btn-outline w-full border border-gray-200 shadow">
          로그인
        </button>
      </form>
      <button
        type="button"
        onClick={() => {close(); navigate("/register")}}
        className="btn btn-outline w-full border border-gray-200 shadow mt-3"
      >
        회원가입
      </button>
    </div>
  );
}
