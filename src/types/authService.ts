import { api } from "../api/axiosInstance";

export const withdrawMember = async (): Promise<void> => {
    await api.delete("/auth/me");
};