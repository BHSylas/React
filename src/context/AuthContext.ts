import { createContext } from "react";

export interface AuthContextType {
  isLoggedIn: boolean;
  loginToken: string | null;
  username: string | null;
  email: string | null;
  point: number | null;
  isAuthReady: boolean;
  login: (token: string, username: string, email: string | null, point: number | null) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  loginToken: null,
  username: null,
  email: null,
  point: null,
  isAuthReady: false,
  login: () => {},
  logout: () => {},
});
