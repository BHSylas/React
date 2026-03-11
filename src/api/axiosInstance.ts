import axios from "axios";
import { isTokenExpired } from "../utils/jwt";

export const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

const clearClientAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("nickname");
    delete api.defaults.headers.common.Authorization;
};

api.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("token");

        if (!token) {
            return config;
        }

        if (!isTokenExpired(token)) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${token}`;
            return config;
        }

        try {
            localStorage.removeItem("token");
            delete api.defaults.headers.common.Authorization;

            const res = await axios.post(
                "/api/auth/refresh",
                {},
                { withCredentials: true }
            );

            const newToken = res.data.accessToken;
            const refreshedName = res.data.name ?? res.data.userName;
            const refreshedNickname = res.data.nickname ?? res.data.userNickname;

            localStorage.setItem("token", newToken);
            api.defaults.headers.common.Authorization = `Bearer ${newToken}`;

            if (refreshedName) {
                localStorage.setItem("name", refreshedName);
            }

            if (refreshedNickname) {
                localStorage.setItem("nickname", refreshedNickname);
            }

            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${newToken}`;

            return config;
        } catch (error) {
            clearClientAuth();
            window.location.href = "/";
            return Promise.reject(error);
        }
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (res) => res,
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url || "";

        if (!status) {
            return Promise.reject(error);
        }

        if (status === 400) {
            return Promise.reject(error);
        }

        if (status === 401) {
            clearClientAuth();
            window.location.href = "/";
            return Promise.reject(error);
        }

        if (status === 403) {
            if (
                url.includes("/auth/me") ||
                url.includes("/auth/signup") ||
                url.includes("/auth/send-verification-code") ||
                url.includes("/auth/verify-email-code") ||
                url.includes("/auth/find-email") ||
                url.includes("/auth/password-reset/send-code") ||
                url.includes("/auth/password-reset/verify-code") ||
                url.includes("/auth/password-reset/confirm")
            ) {
                return Promise.reject(error);
            }

            window.location.href = "/error/403";
            return Promise.reject(error);
        }

        if (status === 429) {
            window.location.href = "/error/429";
            return Promise.reject(error);
        }

        if (status === 500) {
            if (
                url.includes("/auth/find-email") ||
                url.includes("/auth/password-reset/send-code") ||
                url.includes("/auth/password-reset/verify-code") ||
                url.includes("/auth/password-reset/confirm")
            ) {
                return Promise.reject(error);
            }

            window.location.href = "/error/500";
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);