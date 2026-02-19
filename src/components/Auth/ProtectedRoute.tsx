import { useAuth } from "../../hooks/useAuth";
import { useContext, type JSX } from "react";
import { AuthModalContext } from "../../context/AuthModalContext";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isLoggedIn, isAuthReady, } = useAuth();
  const { openLogin } = useContext(AuthModalContext);

  if (!isAuthReady) {
    return <div className="p-6">인증 상태 확인 중...</div>;
  }

  if (!isLoggedIn) {
    openLogin();
  }
  return children;
}
