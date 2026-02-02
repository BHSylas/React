// api.ts
import axios from "axios";
import { isTokenExpired } from "../utils/jwt";
import { useNavigate } from "react-router-dom";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// 요청 인터셉터
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // 요청 전에 직접 만료 체크
    if (isTokenExpired(token)) {
      localStorage.removeItem("token");
      return Promise.reject("Token expired before request.");
    }

    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const navigate = useNavigate();
    const status = error.response?.status;

    if (!status) {
      return Promise.reject(error);
    }

    // 401 → 인증 만료/실패 → 로그인 페이지
    if (status === 401 || !localStorage.getItem('token')) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    // 403 → 접근 권한 없음
    if (status === 403) {
      navigate("/error/403");
      return;
    }

    // 400 → 잘못된 요청
    if (status === 400) {
      navigate("/error/400");
      return;
    }

    // 429 → 요청 과다
    if (status === 429) {
      navigate("/error/429");
      return;
    }
    if(status === 500) {
      navigate("/error/500");
    }
    // 기타 4XX/5XX
    window.location.href = `/error/${status}`;

    return Promise.reject(error);
  }
);
