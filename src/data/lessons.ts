import { cs50Week0Captions } from "./cs50-week0-captions";

export type LessonCaption = {
  startSeconds: number;
  endSeconds: number;
  textKo: string;
  textEn?: string;
};

export type CourseLesson = {
  order: number;
  title: string;
  videoId: string;
  embedUrl: string;
  sourceUrl: string;
  cs50Url?: string;
  captionLanguage?: "ko";
  captionLabel?: string;
  captions: LessonCaption[];
};

const embed = (videoId: string) => `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`;
const source = (videoId: string) => `https://youtu.be/${videoId}`;

const makeCaptions = (lines: string[]): LessonCaption[] =>
  lines.map((textKo, index) => ({
    startSeconds: index * 300,
    endSeconds: (index + 1) * 300,
    textKo,
  }));

const cs50Lessons: CourseLesson[] = [
  {
    order: 1,
    title: "Week 0: Scratch",
    videoId: "UuIEbpQms8o",
    embedUrl: embed("UuIEbpQms8o"),
    sourceUrl: source("UuIEbpQms8o"),
    captionLanguage: "ko",
    captionLabel: "자체 한글 자막",
    cs50Url: "https://cs50.harvard.edu/x/2026/weeks/0/",
    captions: cs50Week0Captions,
  },
  {
    order: 2,
    title: "Week 1: C",
    videoId: "SlqjA04_dpk",
    embedUrl: embed("SlqjA04_dpk"),
    sourceUrl: source("SlqjA04_dpk"),
    captionLanguage: "ko",
    captionLabel: "정렬 자막 준비 중",
    cs50Url: "https://cs50.harvard.edu/x/2026/weeks/1/",
    captions: [],
  },
  {
    order: 3,
    title: "Week 2: Arrays",
    videoId: "h5Gc1n8ZuU8",
    embedUrl: embed("h5Gc1n8ZuU8"),
    sourceUrl: source("h5Gc1n8ZuU8"),
    captionLanguage: "ko",
    captionLabel: "정렬 자막 준비 중",
    cs50Url: "https://cs50.harvard.edu/x/2026/weeks/2/",
    captions: [],
  },
  {
    order: 4,
    title: "Week 3: Algorithms",
    videoId: "6Svu_ae5ebk",
    embedUrl: embed("6Svu_ae5ebk"),
    sourceUrl: source("6Svu_ae5ebk"),
    captionLanguage: "ko",
    captionLabel: "정렬 자막 준비 중",
    cs50Url: "https://cs50.harvard.edu/x/2026/weeks/3/",
    captions: [],
  },
  {
    order: 5,
    title: "Week 4: Memory",
    videoId: "db0H0U13YsA",
    embedUrl: embed("db0H0U13YsA"),
    sourceUrl: source("db0H0U13YsA"),
    captionLanguage: "ko",
    captionLabel: "정렬 자막 준비 중",
    cs50Url: "https://cs50.harvard.edu/x/2026/weeks/4/",
    captions: [],
  },
  {
    order: 6,
    title: "Week 5: Data Structures",
    videoId: "PmAI76OGE_E",
    embedUrl: embed("PmAI76OGE_E"),
    sourceUrl: source("PmAI76OGE_E"),
    captionLanguage: "ko",
    captionLabel: "정렬 자막 준비 중",
    cs50Url: "https://cs50.harvard.edu/x/2026/weeks/5/",
    captions: [],
  },
  {
    order: 7,
    title: "Week 6: Python",
    videoId: "Rl0ludWTLxs",
    embedUrl: embed("Rl0ludWTLxs"),
    sourceUrl: source("Rl0ludWTLxs"),
    captionLanguage: "ko",
    captionLabel: "정렬 자막 준비 중",
    cs50Url: "https://cs50.harvard.edu/x/2026/weeks/6/",
    captions: [],
  },
  {
    order: 8,
    title: "Week 7: SQL",
    videoId: "oqRU2So6Z2Y",
    embedUrl: embed("oqRU2So6Z2Y"),
    sourceUrl: source("oqRU2So6Z2Y"),
    captionLanguage: "ko",
    captionLabel: "정렬 자막 준비 중",
    cs50Url: "https://cs50.harvard.edu/x/2026/weeks/7/",
    captions: [],
  },
  {
    order: 9,
    title: "Week 8: HTML, CSS, JavaScript",
    videoId: "yYst7puZXjw",
    embedUrl: embed("yYst7puZXjw"),
    sourceUrl: source("yYst7puZXjw"),
    captionLanguage: "ko",
    captionLabel: "정렬 자막 준비 중",
    cs50Url: "https://cs50.harvard.edu/x/2026/weeks/8/",
    captions: [],
  },
  {
    order: 10,
    title: "Week 9: Flask",
    videoId: "am7POvSZ4GE",
    embedUrl: embed("am7POvSZ4GE"),
    sourceUrl: source("am7POvSZ4GE"),
    captionLanguage: "ko",
    captionLabel: "정렬 자막 준비 중",
    cs50Url: "https://cs50.harvard.edu/x/2026/weeks/9/",
    captions: [],
  },
  {
    order: 11,
    title: "Week 10: Cybersecurity",
    videoId: "ApQTgFkf8TU",
    embedUrl: embed("ApQTgFkf8TU"),
    sourceUrl: source("ApQTgFkf8TU"),
    captionLanguage: "ko",
    captionLabel: "정렬 자막 준비 중",
    cs50Url: "https://cs50.harvard.edu/x/2026/weeks/10/",
    captions: [],
  },
];

export const courseLessons: Record<string, CourseLesson[]> = {
  "harvard-cs50x": cs50Lessons,
};
