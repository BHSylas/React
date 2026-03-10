export default function displayRole(role: number | string | null | undefined) {
    if (role === null || role === undefined) return "알 수 없음";

    switch (String(role).toUpperCase()) {
        case "0":
        case "USER":
        case "ROLE_USER":
            return "학생";
        case "1":
        case "PROFESSOR":
        case "ROLE_PROFESSOR":
            return "교수";
        case "2":
        case "ADMIN":
        case "ROLE_ADMIN":
            return "관리자";
        default:
            return "알 수 없음";
    }
}