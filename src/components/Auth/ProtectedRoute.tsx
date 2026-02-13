import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { JSX } from "react";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isLoggedIn, isAuthReady } = useAuth();

  if (!isAuthReady) {
    return <div className="p-6">인증 상태 확인 중...</div>;
  }

  if (!isLoggedIn) {
    localStorage.setItem("requireLogin", "yes");
    return <Navigate to="/" replace/>;
  }
  localStorage.removeItem("requireLogin");

  return children;
}
