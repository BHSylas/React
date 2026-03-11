import { api } from "../api/axiosInstance";

export const withdrawMember = async (): Promise<void> => {
    await api.delete("/auth/me");
};

export const requestLogout = async (): Promise<void> => {
    await api.post("/auth/logout");
};

export const updateMyProfile = async (data: { name: string; nickname: string }) => {
    const res = await api.patch("/auth/me/profile", data);
    return res.data;
};

export const findEmail = async (data: { name: string; nickname: string }) => {
    const res = await api.post("/auth/find-email", data);
    return res.data;
};

export const sendPasswordResetCode = async (data: { email: string }) => {
    const res = await api.post("/auth/password-reset/send-code", data);
    return res.data;
};

export const verifyPasswordResetCode = async (data: { email: string; code: string }) => {
    const res = await api.post("/auth/password-reset/verify-code", data);
    return res.data;
};

export const confirmPasswordReset = async (data: {
    email: string;
    code: string;
    newPassword: string;
}) => {
    const res = await api.post("/auth/password-reset/confirm", data);
    return res.data;
};