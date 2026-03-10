import { useAuth } from "../../hooks/useAuth";
import { useEffect, useRef, type JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { isLoggedIn, isAuthReady } = useAuth();
    const location = useLocation();
    const hasAlertedRef = useRef(false);

    useEffect(() => {
        if (!isAuthReady) return;

        const isWithdrawing = localStorage.getItem("isWithdrawing");
        const isLoggingOut = localStorage.getItem("isLoggingOut");

        if (!isLoggedIn && isWithdrawing) {
            localStorage.removeItem("isWithdrawing");
            return;
        }

        if (!isLoggedIn && isLoggingOut) {
            localStorage.removeItem("isLoggingOut");
            return;
        }

        if (!isLoggedIn && !hasAlertedRef.current) {
            alert("로그인이 필요한 서비스입니다.");
            hasAlertedRef.current = true;
        }
    }, [isAuthReady, isLoggedIn]);

    if (!isAuthReady) {
        return <div className="p-6">인증 상태 확인 중...</div>;
    }

    const isWithdrawing = localStorage.getItem("isWithdrawing");
    const isLoggingOut = localStorage.getItem("isLoggingOut");

    if (!isLoggedIn) {
        if (isWithdrawing) {
            return <Navigate to="/" replace />;
        }

        if (isLoggingOut) {
            return <Navigate to="/" replace />;
        }

        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return children;
}