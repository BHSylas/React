const countryToLanguage: Record<string, string> = {
    USA: '영어',
    JAPAN: '일본어',
    CHINA: '중국어',
    GERMANY: '독일어',
    ITALY: '이탈리아어'
};

const countryToKoreaName: Record<string, string> = {
    USA: '미국',
    JAPAN: '일본',
    CHINA: '중국',
    GERMANY: '독일',
    ITALY: '이탈리아'
};

const levelToKoreaName: Record<string, string> = {
    BEGINNER: '초급',
    INTERMEDIATE: '중급',
    ADVANCED: '고급'
};

export  const getLanguageName = (code: string) => {
    return countryToLanguage[code] || code;
};

export const getCountryName = (code: string) => {
    return countryToKoreaName[code] || code;
};

export  const getLevelName = (code: string) => {
    return levelToKoreaName[code] || code;
};
