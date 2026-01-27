// provider/AuthProvider.tsx
import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../api/axiosInstance";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
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
        isAuthReady,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
