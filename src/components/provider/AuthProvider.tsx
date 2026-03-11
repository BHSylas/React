import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../api/axiosInstance";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { requestLogout } from "../../types/authService";

interface AuthProviderProps {
    children: ReactNode;
}

interface TokenPayload extends JwtPayload {
    role: number | string;
}

interface MeResponse {
    userId: number;
    email: string;
    name: string;
    nickname: string;
    role: number;
    roleName: string;
    createdAt: string;
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [nickname, setNickname] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    const clearAuthState = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("nickname");
        delete api.defaults.headers.common.Authorization;

        setIsLoggedIn(false);
        setToken(null);
        setName(null);
        setNickname(null);
        setRole(null);
    };

    const setRoleFromToken = (accessToken: string) => {
        try {
            const decoded = jwtDecode<TokenPayload>(accessToken);
            setRole(String(decoded.role));
        } catch (error) {
            console.error("토큰 해독 실패", error);
            setRole(null);
        }
    };

    useEffect(() => {
        const bootstrapAuth = async () => {
            const savedToken = localStorage.getItem("token");

            if (!savedToken) {
                clearAuthState();
                setIsAuthReady(true);
                return;
            }

            try {
                api.defaults.headers.common.Authorization = `Bearer ${savedToken}`;

                const { data } = await api.get<MeResponse>("/auth/me");

                setIsLoggedIn(true);
                setToken(savedToken);
                setName(data.name);
                setNickname(data.nickname);

                localStorage.setItem("token", savedToken);
                localStorage.setItem("name", data.name);
                localStorage.setItem("nickname", data.nickname);

                setRoleFromToken(savedToken);
            } catch (error) {
                console.error("인증 복원 실패:", error);
                clearAuthState();
            } finally {
                setIsAuthReady(true);
            }
        };

        bootstrapAuth();
    }, []);

    const login = ({
                       token,
                       name,
                       nickname,
                   }: {
        token: string;
        name: string;
        nickname: string;
    }) => {
        localStorage.setItem("token", token);
        localStorage.setItem("name", name);
        localStorage.setItem("nickname", nickname);

        api.defaults.headers.common.Authorization = `Bearer ${token}`;

        setIsLoggedIn(true);
        setToken(token);
        setName(name);
        setNickname(nickname);
        setRoleFromToken(token);
    };

    const syncProfile = ({ name, nickname }: { name: string; nickname: string }) => {
        localStorage.setItem("name", name);
        localStorage.setItem("nickname", nickname);

        setName(name);
        setNickname(nickname);
    };

    const logout = async () => {
        localStorage.setItem("isLoggingOut", "true");

        try {
            await requestLogout();
        } catch (error) {
            console.error("서버 로그아웃 실패:", error);
        } finally {
            clearAuthState();
            window.location.href = "/";
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                token,
                name,
                nickname,
                role,
                isAuthReady,
                login,
                logout,
                syncProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}