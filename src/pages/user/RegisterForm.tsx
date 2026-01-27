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

  return (
    <div className="max-w-sm mx-auto card bg-base-100 shadow-xl p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4">회원가입</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered w-full"
          required
        />
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered w-full"
          required
        />
        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
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

        <button type="submit" className="btn btn-primary w-full">
          회원가입
        </button>

        <button
          type="button"
          className="btn btn-outline w-full"
          onClick={() => navigate("/login")}
        >
          로그인으로 돌아가기
        </button>
      </form>
    </div>
  );
}
