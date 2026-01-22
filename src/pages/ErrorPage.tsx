// components/ErrorPage.tsx
import { useParams } from "react-router-dom";

export default function ErrorPage() {
  const { status } = useParams<{ status: string }>();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-base-200 rounded-xl">
      <h1 className="text-8xl font-bold mb-4"> :( </h1>
      <h1 className="text-5xl font-bold mb-4">오류가 발생했습니다.</h1>
      <p className="mb-4 text-2xl">
        {status === "404" && "요청하신 페이지를 찾을 수 없습니다."}
        {status === "403" && "접근 권한이 없습니다."}
        {status === "400" && "잘못된 요청입니다."}
        {status === "429" && "요청이 너무 많습니다. 잠시 후 다시 시도해주세요."}
        {status === "500" && "서버가 요청을 처리할 수 없었습니다. 관리자에게 문의하십시오."}
        {status === "502" && "서버에 연결할 수 없었습니다. 관리자에게 문의하십시오."}
      </p>
      <p className="mb-4 text-sm">
        {status === "404" && "404 Not Found"}
        {status === "403" && "403 Unauthorized"}
        {status === "400" && "400 Bad Request"}
        {status === "429" && "429 Too Many Requests"}
        {status === "500" && "500 Internal Server Error"}
        {status === "502" && "502 Bad Gateway"}
      </p>
      <a href="/" className="btn btn-primary">홈으로 돌아가기</a>
    </div>
  );
}
