import { useAuth } from "../../hooks/useAuth";
import { useEffect, useRef, type JSX } from "react";
// import { AuthModalContext } from "../../context/AuthModalContext";
import { useNavigate } from "react-router";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isLoggedIn, isAuthReady, } = useAuth();
  // const { openLogin } = useContext(AuthModalContext);
  const navigate = useNavigate();

  const hasAlerted = useRef(false); // 알람 떴는지 확인

  useEffect(() => {
    // 인증 확인이 끝났는데 로그인이 안 되어 있다면
    if (isAuthReady && !isLoggedIn) {
      if(!hasAlerted.current) { // 알람이 안 떳으면
        alert("로그인이 필요한 서비스입니다.");
        hasAlerted.current = true;
        navigate("/", { replace: true }); // 메인으로 강제 이동
      }
    }
  }, [isLoggedIn, isAuthReady, navigate]);

  // 1. 로딩 중일 때
  if (!isAuthReady) {
    return <div className="p-6">인증 상태 확인 중...</div>;
  }

  // 2. 비로그인 상태일 때 (아무것도 렌더링하지 않음 - useEffect에서 이동 처리)
  if (!isLoggedIn) {
    return null;
  }

  // 3. 로그인 완료 시에만 자식 컴포넌트 보여줌
  return children;
}
