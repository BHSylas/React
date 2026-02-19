export default  function displayCategory(raw : string) {
    switch(raw) {
        case "NOTICE":
            return "공지";
        case "FREE":
            return "자유게시판";
        case "LECTURE_QNA":
            return "강의 Q&A";
        case "MANUAL":
            return "매뉴얼";
        default:
            return raw;
    }
}