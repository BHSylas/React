export default function displayRole(role : number) {
    switch(role) {
        case 0:
            return "유저";
        case 1:
            return "교수";
        case 2:
            return "관리자";
        default:
            return "CHEATER";
    }
}