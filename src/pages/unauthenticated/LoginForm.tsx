import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import GoogleIcon from "../../../public/Google__G__logo.svg";
import KakaoIcon from "../../../public/Kakao_Corp._symbol_-_2012.svg";
import NaverIcon from "../../../public/Naver_logo.png";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //const [requireLogin, setRequireLogin] = useState<string | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  if(localStorage.getItem('requireLogin')){
    //setRequireLogin(localStorage.getItem('requireLogin'));
    localStorage.removeItem('requireLogin');
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(username.length === 0) {
      setError("아이디가 비어있습니다.");
      return;
    }
    if(password.length === 0) {
      setError("비밀번호가 비어있습니다.");
      return;
    }
    setError("");
    try {
      const res = await axios.post("/api/auth/login", { username, password });
      const token = res.data.token;
      if (token) {
        login(token, username, null, res.data.point);
        //const userRes = await axios.get("/api/user/my");
        //login(token, userRes.data.username, userRes.data.email, userRes.data.point);
        // TODO: alert 대신 toast UI로 변경 가능
        alert("로그인 성공!");
        navigate("/");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      console.log(err);
      setError("로그인 실패. 아이디 또는 비밀번호를 확인하세요.");
    }
  };
  return (
    <div>
      <div className="max-w-sm mx-auto card bg-base-200 shadow-xl p-6 mt-10">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold mb-4">로그인</h2>
          <button className="btn btn-primary px-2" onClick={() => navigate('/feed')}>← 피드로</button>
        </div>
        <p className="text-red-500 text-sm text-center m-2">{error}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input input-bordered w-full"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full"
          />
          <button type="submit" className="btn btn-primary w-full bg-base-100">
            로그인
          </button>
        </form>
        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="btn btn-outline w-full bg-base-100"
          >
            회원가입
          </button>
        </div>
        <div className="divider my-2"></div>
        <div className="flex-1 text-xl text-center font-bold mb-4">소셜 계정으로 로그인</div>
        <div className="flex flex-row justify-around">
          <a className="btn bg-white w-10 h-10 rounded-full p-0" onClick={() => window.location.href = "/api/auth/login/google"}><img src={GoogleIcon} /></a>
          <a className="btn bg-green-600 w-10 h-10 rounded-full p-3" onClick={() => window.location.href = "/api/auth/login/naver"}><img src={NaverIcon} /></a>
          <a className="btn bg-yellow-400 w-10 h-10 rounded-full p-2" onClick={() => window.location.href = "/api/auth/login/kakao"}><img className="mt-0.5" src={KakaoIcon} /></a>
        </div>
      </div>
    </div>
  );
}
