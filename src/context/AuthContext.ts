// context/AuthContext.ts
import { createContext } from "react";

export interface AuthContextType {
  isLoggedIn: boolean;
  token: string | null;
  name: string | null;
  nickname: string | null;
  role: string | null;
  isAuthReady: boolean;
  login: (payload: {
    token: string;
    name: string;
    nickname: string;
  }) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  token: null,
  name: null,
  nickname: null,
  role: null,
  isAuthReady: false,
  login: () => {},
  logout: () => {},
});
