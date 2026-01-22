import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { JSX } from "react";

export default function AdminRoute({ children }: { children: JSX.Element }) {
  const { isLoggedIn, isAuthReady, username } = useAuth();

  if (!isAuthReady) {
    return <div className="p-6">인증 상태 확인 중...</div>;
  }

  if (isLoggedIn && username === "admin") { // Temporary check, should be replaced with proper role check later
    return children;
  }

  return <Navigate to="/login" replace />;
}
