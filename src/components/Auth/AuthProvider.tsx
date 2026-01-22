import { useState, type ReactNode, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../api/axiosInstance";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginToken, setLoginToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [point, setPoint] = useState<number| null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // JWT exp 체크 함수
  const isTokenExpired = (token: string) => {
    try {
      const { exp } = JSON.parse(atob(token.split(".")[1]));
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  };

  // 앱 시작 시 localStorage에서 인증 복원
  useEffect(() => {
    if(isLoggedIn) return; // 이미 로그인 상태면 무시
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("username");
    if(localStorage.getItem("point") === null) localStorage.setItem("point", "0");
    const pointer = Number(localStorage.getItem("point"));
    if(token || savedUser) api.get("/user/checkToken").catch(() => {localStorage.removeItem("token");});
    if (token && !isTokenExpired(token)) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      setIsLoggedIn(true);
      setLoginToken(token);
      setPoint(pointer);
      setUsername(savedUser);
    }
    setIsAuthReady(true); // 초기 인증 체크 완료
  }, []);

  const login = (token: string, username: string, email: string | null, point: number | null) => {
    if(email === null && point === null) {
      api.get("/user/my")
      .then((res) => {
        email = res.data.email;
        point = res.data.point;;
        setEmail(email);
        setPoint(point);
      })
      .catch((e: any) => {console.error(e);});
    }
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("point", (point !== null && point !== undefined) ? point.toString() : "0");
    setEmail(email);
    setPoint(point);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setIsLoggedIn(true);
    setLoginToken(token);
    setUsername(username);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout", {
        username: username,
        token: loginToken,
      });
    } catch (e) {
      console.error(e);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("point");

    setIsLoggedIn(false);
    setLoginToken(null);
    setUsername(null);

    window.location.href = "/feed";
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        loginToken,
        username,
        email,
        point,
        isAuthReady,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
