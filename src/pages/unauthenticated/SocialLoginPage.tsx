import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function SocialLoginPage() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const username = params.get("username");
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && username) {
      login(token, username, null, null); //temporarily null, should fix later
      navigate("/");
    }
  }, [token, username]);
  return (<p>로그인 처리 중...</p>);
}