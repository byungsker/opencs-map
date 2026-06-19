export type CourseLesson = {
  order: number;
  title: string;
  videoId: string;
  embedUrl: string;
  sourceUrl: string;
  cs50Url?: string;
  captionLanguage?: "ko";
  captionLabel?: string;
};

const cs50Lessons: CourseLesson[] = [
  { order: 1, title: "Week 0: Scratch", videoId: "UuIEbpQms8o", embedUrl: "https://www.youtube.com/embed/UuIEbpQms8o?cc_load_policy=1&cc_lang_pref=ko", sourceUrl: "https://youtu.be/UuIEbpQms8o", captionLanguage: "ko", captionLabel: "한글 자막 우선", cs50Url: "https://cs50.harvard.edu/x/2026/weeks/0/" },
  { order: 2, title: "Week 1: C", videoId: "SlqjA04_dpk", embedUrl: "https://www.youtube.com/embed/SlqjA04_dpk?cc_load_policy=1&cc_lang_pref=ko", sourceUrl: "https://youtu.be/SlqjA04_dpk", captionLanguage: "ko", captionLabel: "한글 자막 우선", cs50Url: "https://cs50.harvard.edu/x/2026/weeks/1/" },
  { order: 3, title: "Week 2: Arrays", videoId: "h5Gc1n8ZuU8", embedUrl: "https://www.youtube.com/embed/h5Gc1n8ZuU8?cc_load_policy=1&cc_lang_pref=ko", sourceUrl: "https://youtu.be/h5Gc1n8ZuU8", captionLanguage: "ko", captionLabel: "한글 자막 우선", cs50Url: "https://cs50.harvard.edu/x/2026/weeks/2/" },
  { order: 4, title: "Week 3: Algorithms", videoId: "6Svu_ae5ebk", embedUrl: "https://www.youtube.com/embed/6Svu_ae5ebk?cc_load_policy=1&cc_lang_pref=ko", sourceUrl: "https://youtu.be/6Svu_ae5ebk", captionLanguage: "ko", captionLabel: "한글 자막 우선", cs50Url: "https://cs50.harvard.edu/x/2026/weeks/3/" },
  { order: 5, title: "Week 4: Memory", videoId: "db0H0U13YsA", embedUrl: "https://www.youtube.com/embed/db0H0U13YsA?cc_load_policy=1&cc_lang_pref=ko", sourceUrl: "https://youtu.be/db0H0U13YsA", captionLanguage: "ko", captionLabel: "한글 자막 우선", cs50Url: "https://cs50.harvard.edu/x/2026/weeks/4/" },
  { order: 6, title: "Week 5: Data Structures", videoId: "PmAI76OGE_E", embedUrl: "https://www.youtube.com/embed/PmAI76OGE_E?cc_load_policy=1&cc_lang_pref=ko", sourceUrl: "https://youtu.be/PmAI76OGE_E", captionLanguage: "ko", captionLabel: "한글 자막 우선", cs50Url: "https://cs50.harvard.edu/x/2026/weeks/5/" },
  { order: 7, title: "Week 6: Python", videoId: "Rl0ludWTLxs", embedUrl: "https://www.youtube.com/embed/Rl0ludWTLxs?cc_load_policy=1&cc_lang_pref=ko", sourceUrl: "https://youtu.be/Rl0ludWTLxs", captionLanguage: "ko", captionLabel: "한글 자막 우선", cs50Url: "https://cs50.harvard.edu/x/2026/weeks/6/" },
  { order: 8, title: "Week 7: SQL", videoId: "oqRU2So6Z2Y", embedUrl: "https://www.youtube.com/embed/oqRU2So6Z2Y?cc_load_policy=1&cc_lang_pref=ko", sourceUrl: "https://youtu.be/oqRU2So6Z2Y", captionLanguage: "ko", captionLabel: "한글 자막 우선", cs50Url: "https://cs50.harvard.edu/x/2026/weeks/7/" },
  { order: 9, title: "Week 8: HTML, CSS, JavaScript", videoId: "yYst7puZXjw", embedUrl: "https://www.youtube.com/embed/yYst7puZXjw?cc_load_policy=1&cc_lang_pref=ko", sourceUrl: "https://youtu.be/yYst7puZXjw", captionLanguage: "ko", captionLabel: "한글 자막 우선", cs50Url: "https://cs50.harvard.edu/x/2026/weeks/8/" },
  { order: 10, title: "Week 9: Flask", videoId: "am7POvSZ4GE", embedUrl: "https://www.youtube.com/embed/am7POvSZ4GE?cc_load_policy=1&cc_lang_pref=ko", sourceUrl: "https://youtu.be/am7POvSZ4GE", captionLanguage: "ko", captionLabel: "한글 자막 우선", cs50Url: "https://cs50.harvard.edu/x/2026/weeks/9/" },
  { order: 11, title: "Week 10: Cybersecurity", videoId: "ApQTgFkf8TU", embedUrl: "https://www.youtube.com/embed/ApQTgFkf8TU?cc_load_policy=1&cc_lang_pref=ko", sourceUrl: "https://youtu.be/ApQTgFkf8TU", captionLanguage: "ko", captionLabel: "한글 자막 우선", cs50Url: "https://cs50.harvard.edu/x/2026/weeks/10/" },
];

export const courseLessons: Record<string, CourseLesson[]> = {
  "harvard-cs50x": cs50Lessons,
};
