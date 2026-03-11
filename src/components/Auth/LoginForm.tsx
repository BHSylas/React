import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import {
    findEmail,
    sendPasswordResetCode,
    verifyPasswordResetCode,
    confirmPasswordReset
} from "../../types/authService";

export default function LoginForm() {
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [showFindEmailModal, setShowFindEmailModal] = useState(false);
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

    const [findName, setFindName] = useState("");
    const [findNickname, setFindNickname] = useState("");
    const [findEmailMessage, setFindEmailMessage] = useState("");
    const [isFindingEmail, setIsFindingEmail] = useState(false);

    const [resetEmail, setResetEmail] = useState("");
    const [resetCode, setResetCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [resetMessage, setResetMessage] = useState("");
    const [isResetLoading, setIsResetLoading] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isCodeVerified, setIsCodeVerified] = useState(false);

    const passwordRegex =
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    const isNewPasswordValid = passwordRegex.test(newPassword);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await axios.post("/api/auth/login", {
                email: email.trim(),
                password,
            });

            const { accessToken, name, nickname } = res.data;

            login({
                token: accessToken,
                name,
                nickname,
            });

            window.location.href = "/home";
        } catch (e: any) {
            console.error("로그인 실패:", e);
            setError(e?.response?.data?.message || "로그인 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFindEmail = async () => {
        if (!findName.trim() || !findNickname.trim()) {
            setFindEmailMessage("이름과 닉네임을 모두 입력해주세요.");
            return;
        }

        setIsFindingEmail(true);
        setFindEmailMessage("");

        try {
            const res = await findEmail({
                name: findName.trim(),
                nickname: findNickname.trim(),
            });
            setFindEmailMessage(
                res?.message || "입력하신 정보와 일치하는 계정이 있으면 안내 메일을 발송했습니다."
            );
        } catch (e: any) {
            setFindEmailMessage(
                e?.response?.data?.message || "아이디 찾기 요청 중 오류가 발생했습니다."
            );
        } finally {
            setIsFindingEmail(false);
        }
    };

    const handleSendResetCode = async () => {
        if (!resetEmail.trim()) {
            setResetMessage("이메일을 입력해주세요.");
            return;
        }

        setIsResetLoading(true);
        setResetMessage("");

        try {
            const res = await sendPasswordResetCode({ email: resetEmail.trim() });
            setIsCodeSent(true);
            setResetMessage(res?.message || "인증번호가 발송되었습니다.");
        } catch (e: any) {
            setResetMessage(
                e?.response?.data?.message || "인증번호 발송 중 오류가 발생했습니다."
            );
        } finally {
            setIsResetLoading(false);
        }
    };

    const handleVerifyResetCode = async () => {
        if (!resetEmail.trim() || !resetCode.trim()) {
            setResetMessage("이메일과 인증번호를 입력해주세요.");
            return;
        }

        setIsResetLoading(true);
        setResetMessage("");

        try {
            const res = await verifyPasswordResetCode({
                email: resetEmail.trim(),
                code: resetCode.trim(),
            });
            setIsCodeVerified(true);
            setResetMessage(res?.message || "인증이 완료되었습니다.");
        } catch (e: any) {
            setResetMessage(
                e?.response?.data?.message || "인증번호 확인 중 오류가 발생했습니다."
            );
        } finally {
            setIsResetLoading(false);
        }
    };

    const handleConfirmResetPassword = async () => {
        if (!resetEmail.trim() || !resetCode.trim() || !newPassword.trim()) {
            setResetMessage("이메일, 인증번호, 새 비밀번호를 모두 입력해주세요.");
            return;
        }

        if (!isNewPasswordValid) {
            setResetMessage("새 비밀번호는 영문, 숫자, 특수문자를 포함한 8~16자여야 합니다.");
            return;
        }

        setIsResetLoading(true);
        setResetMessage("");

        try {
            const res = await confirmPasswordReset({
                email: resetEmail.trim(),
                code: resetCode.trim(),
                newPassword: newPassword.trim(),
            });

            alert(res?.message || "비밀번호가 변경되었습니다.");
            setShowResetPasswordModal(false);
            setResetEmail("");
            setResetCode("");
            setNewPassword("");
            setIsCodeSent(false);
            setIsCodeVerified(false);
            setResetMessage("");
        } catch (e: any) {
            setResetMessage(
                e?.response?.data?.message || "비밀번호 변경 중 오류가 발생했습니다."
            );
        } finally {
            setIsResetLoading(false);
        }
    };

    const inputStyle =
        "w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-sm font-medium placeholder:text-blue-500";

    return (
        <>
            <div className="max-w-[450px] mx-auto bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-10 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <header className="mb-8 text-center">
                    <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
                        Welcome Back
                    </p>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter">로그인</h2>
                </header>

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputStyle}
                        required
                    />

                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={inputStyle}
                        required
                    />

                    {error && <p className="text-red-500 text-[13px] font-medium ml-2">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all"
                    >
                        {isLoading ? "로그인 중..." : "로그인"}
                    </button>
                </form>

                <div className="flex justify-center gap-4 mt-5 text-[13px] font-medium">
                    <button
                        type="button"
                        onClick={() => setShowFindEmailModal(true)}
                        className="text-blue-600 hover:text-blue-700"
                    >
                        아이디 찾기
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                        type="button"
                        onClick={() => setShowResetPasswordModal(true)}
                        className="text-blue-600 hover:text-blue-700"
                    >
                        비밀번호 찾기
                    </button>
                </div>
            </div>

            {showFindEmailModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-md rounded-[1rem] p-8 shadow-2xl">
                        <h2 className="text-2xl font-black text-gray-900 mb-6">아이디 찾기</h2>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="이름"
                                value={findName}
                                onChange={(e) => setFindName(e.target.value)}
                                className={inputStyle}
                            />
                            <input
                                type="text"
                                placeholder="닉네임"
                                value={findNickname}
                                onChange={(e) => setFindNickname(e.target.value)}
                                className={inputStyle}
                            />
                        </div>

                        {findEmailMessage && (
                            <p className="mt-4 text-[13px] text-blue-600 font-medium">{findEmailMessage}</p>
                        )}

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => {
                                    setShowFindEmailModal(false);
                                    setFindName("");
                                    setFindNickname("");
                                    setFindEmailMessage("");
                                }}
                                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                            >
                                닫기
                            </button>
                            <button
                                onClick={handleFindEmail}
                                disabled={isFindingEmail}
                                className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all"
                            >
                                {isFindingEmail ? "처리 중..." : "확인"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showResetPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-md rounded-[1rem] p-8 shadow-2xl">
                        <h2 className="text-2xl font-black text-gray-900 mb-6">비밀번호 찾기</h2>

                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <input
                                    type="email"
                                    placeholder="이메일"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    className={inputStyle}
                                />
                                <button
                                    type="button"
                                    onClick={handleSendResetCode}
                                    disabled={isResetLoading}
                                    className="text-[12px] px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-[90px]"
                                >
                                    {isResetLoading ? "..." : "코드발송"}
                                </button>
                            </div>

                            {isCodeSent && (
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="인증번호"
                                        value={resetCode}
                                        onChange={(e) => setResetCode(e.target.value)}
                                        className={inputStyle}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleVerifyResetCode}
                                        disabled={isResetLoading}
                                        className="text-[12px] px-4 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 w-[90px]"
                                    >
                                        확인
                                    </button>
                                </div>
                            )}

                            {isCodeVerified && (
                                <input
                                    type="password"
                                    placeholder="새 비밀번호"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className={inputStyle}
                                />
                            )}
                        </div>

                        {resetMessage && (
                            <p className="mt-4 text-[13px] text-blue-600 font-medium">{resetMessage}</p>
                        )}

                        {!isNewPasswordValid && newPassword && (
                            <p className="mt-2 text-red-500 text-[12px]">
                                새 비밀번호는 영문, 숫자, 특수문자를 포함한 8~16자여야 합니다.
                            </p>
                        )}

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => {
                                    setShowResetPasswordModal(false);
                                    setResetEmail("");
                                    setResetCode("");
                                    setNewPassword("");
                                    setResetMessage("");
                                    setIsCodeSent(false);
                                    setIsCodeVerified(false);
                                }}
                                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                            >
                                닫기
                            </button>

                            {isCodeVerified ? (
                                <button
                                    onClick={handleConfirmResetPassword}
                                    disabled={isResetLoading}
                                    className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all"
                                >
                                    {isResetLoading ? "변경 중..." : "비밀번호 변경"}
                                </button>
                            ) : (
                                <button
                                    disabled
                                    className="flex-1 py-3 bg-gray-300 text-white rounded-2xl font-bold cursor-not-allowed"
                                >
                                    비밀번호 변경
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}