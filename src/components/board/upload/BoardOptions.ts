export const BOARD_ROLE_OPTION = [
    { value: "FREE", label: "자유게시판", roles: ["2", "1", "0", "ROLE_USER", "ROLE_PROFESSOR", "ROLE_ADMIN"] },
    { value: "QNA", label: "Q&A", roles: ["1", "0", "ROLE_USER", "ROLE_PROFESSOR"] },
    // { value: "LECTURE_QNA", label: "강의 Q&A", roles: ["0"] },
    { value: "NOTICE", label: "공지사항", roles: ["2", "ROLE_ADMIN"] },
    { value: "FAQ", label: "FAQ", roles: ["2", "ROLE_ADMIN"] },
    { value: "MANUAL", label: "매뉴얼", roles: ["2", "ROLE_ADMIN"] },
]

export const BOARD_FORM = {
    title: '',
    boardType: "FREE",
    content: '',
    pinned: false,
    lectureId: null as number | null,

}

export const QNA_FORM = {
    title: '',
    boardType: "LECTURE_QNA",
    content: "",
    pinned: false,
    lectureId: null as number | null,
}