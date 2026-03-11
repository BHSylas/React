import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegisterForm() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [verificationCode, SetVerificationCode] = useState("");
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isEmailLoading, setIsEmailLoading] = useState(false);
    const [emailMessage, setEmailMessage] = useState("");

    const navigate = useNavigate();

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    const isPasswordValid = passwordRegex.test(password);
    const isPasswordMatch = password === confirmPassword && confirmPassword !== "";

    const handleEmailChange = (value: string) => {
        setEmail(value);
        setIsEmailSent(false);
        setIsEmailVerified(false);
        SetVerificationCode("");
        setEmailMessage("");
    };

    const handleSendCode = async () => {
        if (!email.trim()) {
            alert("이메일을 입력해주시길 바랍니다.");
            return;
        }

        setIsEmailLoading(true);
        setEmailMessage("");
        setError("");

        try {
            await axios.post("/api/auth/send-verification-code", { email: email.trim() });
            setIsEmailSent(true);
            setEmailMessage("인증번호가 발송되었습니다.");
        } catch (e: any) {
            setEmailMessage(e.response?.data?.message || "인증번호 발송에 실패했습니다.");
        } finally {
            setIsEmailLoading(false);
        }
    };

    const handleEmailVerified = async () => {
        if (!verificationCode.trim()) {
            setEmailMessage("인증번호를 입력해주세요.");
            return;
        }

        setIsEmailLoading(true);
        setError("");

        try {
            await axios.post("/api/auth/verify-email-code", {
                email: email.trim(),
                code: verificationCode.trim()
            });

            setIsEmailVerified(true);
            setEmailMessage("이메일 인증이 완료되었습니다.");
        } catch (e: any) {
            setEmailMessage(e.response?.data?.message || "인증 번호가 일치하지 않습니다.");
        } finally {
            setIsEmailLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!isEmailVerified) {
            setError("이메일 인증을 완료해주시길 바랍니다.");
            return;
        }

        if (!isPasswordValid) {
            setError("비밀번호는 영문, 숫자, 특수문자를 포함한 8~16자여야 합니다.");
            return;
        }

        if (!isPasswordMatch) {
            setError("비밀번호 확인이 일치하지 않습니다.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post("/api/auth/signup", {
                email: email.trim(),
                password,
                name: name.trim(),
                nickname: nickname.trim(),
            });

            if (response.status === 200 || response.status === 201) {
                alert("회원가입이 완료되었습니다.");
                navigate("/");
            }
        } catch (err: any) {
            console.error("회원가입 실패 로그:", err);
            const serverMessage = err.response?.data?.message;
            setError(serverMessage || "회원가입 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle =
        "w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-sm font-medium placeholder:text-blue-500";

    return (
        <div className="max-w-[450px] mx-auto bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-10 mt-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-8 text-center">
                <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Join Us</p>
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter">회원가입</h2>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <div className="flex gap-3">
                        <input
                            type="email"
                            placeholder="이메일"
                            value={email}
                            onChange={(e) => handleEmailChange(e.target.value)}
                            className={inputStyle}
                            required
                        />
                        <button
                            type="button"
                            onClick={handleSendCode}
                            disabled={isEmailVerified || isEmailLoading}
                            className="text-[12px] px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-[80px]"
                        >
                            {isEmailLoading ? "..." : isEmailSent ? "재발송" : "인증 요청"}
                        </button>
                    </div>

                    {emailMessage && !isEmailVerified && (
                        <p className="text-blue-500 text-[12px] font-medium ml-2">{emailMessage}</p>
                    )}

                    {isEmailVerified && (
                        <p className="text-green-600 text-[12px] font-medium ml-2">이메일 인증이 완료되었습니다.</p>
                    )}

                    {isEmailSent && !isEmailVerified && (
                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="인증번호"
                                value={verificationCode}
                                onChange={(e) => SetVerificationCode(e.target.value)}
                                className={inputStyle}
                            />
                            <button
                                type="button"
                                onClick={handleEmailVerified}
                                disabled={isEmailLoading}
                                className="text-[12px] px-4 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 w-[80px]"
                            >
                                확인
                            </button>
                        </div>
                    )}
                </div>

                <input
                    type="text"
                    placeholder="이름"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputStyle}
                    required
                />

                <input
                    type="text"
                    placeholder="닉네임"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
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

                <input
                    type="password"
                    placeholder="비밀번호 확인"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputStyle}
                    required
                />

                {!isPasswordValid && password && (
                    <p className="text-red-500 text-[12px] ml-2">
                        비밀번호는 영문, 숫자, 특수문자를 포함한 8~16자여야 합니다.
                    </p>
                )}

                {!isPasswordMatch && confirmPassword && (
                    <p className="text-red-500 text-[12px] ml-2">비밀번호가 일치하지 않습니다.</p>
                )}

                {error && <p className="text-red-500 text-[13px] font-medium ml-2">{error}</p>}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all"
                >
                    {isLoading ? "가입 중..." : "회원가입"}
                </button>
            </form>
        </div>
    );
}