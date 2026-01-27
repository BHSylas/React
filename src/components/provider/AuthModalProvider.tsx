import { useState, type ReactNode } from "react";
import { AuthModalContext, type AuthModalMode } from "../../context/AuthModalContext";

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthModalMode>("login");

  const openLogin = () => {
    setMode("login");
    setIsOpen(true);
    console.log("Opening Login");
  };

  const openRegister = () => {
    setMode("register");
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        mode,
        openLogin,
        openRegister,
        close,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}
