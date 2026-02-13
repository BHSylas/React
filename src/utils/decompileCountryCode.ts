export function decompileCountryCode (code : string) : string {
    const str = code.toLowerCase();
    switch(str) {
        case "de":
            return "독일어";
            break;
        case "en":
            return "영어";
            break;
        case "jp":
            return "일본어";
            break;
        case "it":
            return "이탈리아어";
            break;
        case "cn":
            return "중국어";
            break;
        default:
            return "?";
            break;
    }
}