import { createContext } from "react";

export type AuthModalMode = "login" | "register";

export interface AuthModalContextType {
  isOpen: boolean;
  mode: AuthModalMode;
  openLogin: () => void;
  openRegister: () => void;
  close: () => void;
}

export const AuthModalContext = createContext<AuthModalContextType>({
  isOpen: false,
  mode: "login",
  openLogin: () => {},
  openRegister: () => {},
  close: () => {},
});
