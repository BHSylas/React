import axios from "axios";
import { isTokenExpired } from "../utils/jwt";

export const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

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

            localStorage.setItem("token", newToken);
            api.defaults.headers.common.Authorization = `Bearer ${newToken}`;

            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${newToken}`;

            return config;
        } catch (error) {
            localStorage.clear();
            delete api.defaults.headers.common.Authorization;
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
            localStorage.clear();
            delete api.defaults.headers.common.Authorization;
            window.location.href = "/";
            return Promise.reject(error);
        }

        if (status === 403) {
            // 개별 화면에서 직접 처리해야 하는 요청은 페이지 이동 막기
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
    }
);