export function decompileLanguageCode (code : string) : string {
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

export function decompileCountryCode (code : string) : string {
    const str = code.toLowerCase();
    switch(str) {
        case "gr":
            return "GERMANY";
        case "us":
            return "USA";
        case "jp": //ja? jp? I don't know...
            return "JAPAN";
        case "it":
            return "ITALY";
        case "cn":
            return "CHINA";
        default:
            return "?";
    }
}

export function compileCountryCode (country : string) : string {
    const str = country.toLowerCase();
    switch(str) {
        case "germany":
            return "GR";
        case "usa":
            return "US";
        case "japan":
            return "JP";
        case "italy":
            return "IT";
        case "china":
            return "CN";
        default:
            return "?";
    }
}