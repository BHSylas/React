import { useContext } from "react";
import { AuthModalContext } from "../../context/AuthModalContext";
import LoginForm from "./LoginForm";
// RegisterForm은 추후 선택적으로

export default function AuthModal() {
  const { isOpen, mode, close } = useContext(AuthModalContext);
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md bg-base-200">
        <button
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={close}
        >
          ✕
        </button>

        {mode === "login" && <LoginForm />}
        {/* mode === "register" && <RegisterForm /> */}
      </div>

      <div className="modal-backdrop" onClick={close} />
    </div>
  );
}
