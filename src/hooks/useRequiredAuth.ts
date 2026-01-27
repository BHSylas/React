import { useAuth } from "./useAuth";
import { useContext } from "react";
import { AuthModalContext } from "../context/AuthModalContext";

export function useRequireAuth() {
  const { isLoggedIn } = useAuth();
  const { openLogin } = useContext(AuthModalContext);

  function requireAuth<T extends (...args: any[]) => void>(
  action: T
): (...args: Parameters<T>) => void {
  return (...args) => {
    if (!isLoggedIn) {
      openLogin();
      return;
    }
    action(...args);
  };
}

  return { requireAuth };
}


