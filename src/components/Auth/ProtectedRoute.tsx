import { useAuth } from "../../hooks/useAuth";
import { useEffect, useRef, type JSX } from "react";
// import { AuthModalContext } from "../../context/AuthModalContext";
import { useNavigate } from "react-router";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isLoggedIn, isAuthReady, } = useAuth();
  // const { openLogin } = useContext(AuthModalContext);
  const navigate = useNavigate();

  const hasAlerted = useRef(false); // 알람 떴는지 확인
  const prevIsLoggout = useRef<boolean | null>(null);

  useEffect(() => {
    if (!isAuthReady) return;

    const isWithdrawing = localStorage.getItem("isWithdrawing"); // 탈퇴중인지 확인용
    
    if (isWithdrawing) {
      // 이동이 완료된 후 플래그 삭제 (메인 페이지로 이동하므로 여기서 지워도 무방)
      if (!isLoggedIn) {
        localStorage.removeItem("isWithdrawing");
      }
      return;
    }

    // 인증 확인이 끝났는데 로그인이 안 되어 있다면
    if (!isLoggedIn && !hasAlerted.current && prevIsLoggout.current === null) {
      alert("로그인이 필요한 서비스입니다.");
      hasAlerted.current = true;
      navigate("/", { replace: true }); // 메인으로 강제 이동
      return;
    }

    if (prevIsLoggout.current === true && !isLoggedIn) {
      alert("로그아웃 되었습니다.");
      navigate("/", { replace: true });
      return;
    }

    prevIsLoggout.current = isLoggedIn;

  }, [isLoggedIn, isAuthReady, navigate]);

  // 로딩 중일 때
  if (!isAuthReady) {
    return <div className="p-6">인증 상태 확인 중...</div>;
  }

  // 비로그인 상태일 때 (아무것도 렌더링하지 않음 - useEffect에서 이동 처리)
  if (!isLoggedIn) {
    return null;
  }

  // 로그인 완료 시에만 자식 컴포넌트 보여줌
  return children;
}
