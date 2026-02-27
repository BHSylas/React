// provider/AuthProvider.tsx
import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../api/axiosInstance";
import { jwtDecode, type JwtPayload } from "jwt-decode";

interface AuthProviderProps {
  children: ReactNode;
}

interface TokenPayload extends JwtPayload {
    role: number | string; // 0, 1, 2 숫자로 들어오면 number
}

export default function AuthProvider ({ children }: AuthProviderProps){
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const isTokenExpired = (token: string) => {
    try {
      const { exp } = JSON.parse(atob(token.split(".")[1]));
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  };

  // 앱 시작 시 인증 복원
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedName = localStorage.getItem("name");
    const savedNickname = localStorage.getItem("nickname");

    if (savedToken && !isTokenExpired(savedToken)) {
      api.defaults.headers.common.Authorization = `Bearer ${savedToken}`;
      setIsLoggedIn(true);
      setToken(savedToken);
      setName(savedName);
      setNickname(savedNickname);
      try {
        const decoded = jwtDecode<TokenPayload>(savedToken);
        setRole(String(decoded.role));
      } 
      catch (error) {
        console.error("토큰 해독 실패", error);
      }
    } else {
      localStorage.clear();
    }

    setIsAuthReady(true);
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
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      setRole(String(decoded.role));
    } 
    catch (error) {
      console.error("토큰 해독 실패", error);
    }
  };

  const logout = () => {
    localStorage.clear();
    delete api.defaults.headers.common.Authorization;

    setIsLoggedIn(false);
    setToken(null);
    setName(null);
    setNickname(null);
    
    window.location.href = "/";
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
