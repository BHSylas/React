export default function displayRole(role: string | number) {
    const roleString = String(role);

    switch (roleString) {
        case "0":
        case "ROLE_USER":
            return "유저";
        case "1":
        case "ROLE_PROFESSOR":
            return "교수";
        case "2":
            return "관리자";
        case "ROLE_ADMIN":
        default:
            console.warn(`알 수 없는 권한 값이 들어왔습니다: ${role}`);
            return "CHEATER";
    }
}