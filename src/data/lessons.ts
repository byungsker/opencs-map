export type LessonCaption = {
  startSeconds: number;
  endSeconds: number;
  textKo: string;
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
    captions: makeCaptions([
      "스크래치로 프로그래밍의 기본 재료인 명령, 반복, 조건을 눈으로 확인합니다.",
      "문제를 작게 나누고 블록을 조합하면서 알고리즘의 감각을 먼저 익힙니다.",
      "이벤트, 변수, 함수는 이후 C와 Python에서도 계속 반복해서 나오는 핵심 개념입니다.",
      "완벽한 문법보다 입력을 받아 처리하고 결과를 내는 흐름을 이해하는 데 집중하면 됩니다.",
    ]),
  },
  {
    order: 2,
    title: "Week 1: C",
    videoId: "SlqjA04_dpk",
    embedUrl: embed("SlqjA04_dpk"),
    sourceUrl: source("SlqjA04_dpk"),
    captionLanguage: "ko",
    captionLabel: "자체 한글 자막",
    cs50Url: "https://cs50.harvard.edu/x/2026/weeks/1/",
    captions: makeCaptions([
      "C 언어로 내려오면 컴퓨터가 실제로 값을 저장하고 계산하는 방식이 더 선명하게 보입니다.",
      "좋은 코드는 정답만 맞히는 것이 아니라 정확성, 설계, 스타일을 함께 만족해야 합니다.",
      "자료형, 변수, 조건문, 반복문은 앞으로 모든 CS50 문제 세트의 기본 도구가 됩니다.",
      "컴파일 오류와 런타임 오류를 구분하고, 에러 메시지를 읽는 습관이 중요합니다.",
      "함수로 코드를 나누면 중복을 줄이고 의도를 더 명확하게 드러낼 수 있습니다.",
    ]),
  },
  {
    order: 3,
    title: "Week 2: Arrays",
    videoId: "h5Gc1n8ZuU8",
    embedUrl: embed("h5Gc1n8ZuU8"),
    sourceUrl: source("h5Gc1n8ZuU8"),
    captionLanguage: "ko",
    captionLabel: "자체 한글 자막",
    cs50Url: "https://cs50.harvard.edu/x/2026/weeks/2/",
    captions: makeCaptions([
      "배열은 같은 종류의 값을 연속된 공간에 담아 순서대로 다루는 방법입니다.",
      "문자열도 결국 문자들의 배열이라는 관점으로 보면 C의 동작이 이해됩니다.",
      "인덱스는 0부터 시작하므로 경계값을 넘지 않도록 조심해야 합니다.",
      "명령줄 인자와 문자열 처리는 실제 프로그램 입력을 다루는 첫 단계입니다.",
    ]),
  },
  {
    order: 4,
    title: "Week 3: Algorithms",
    videoId: "6Svu_ae5ebk",
    embedUrl: embed("6Svu_ae5ebk"),
    sourceUrl: source("6Svu_ae5ebk"),
    captionLanguage: "ko",
    captionLabel: "자체 한글 자막",
    cs50Url: "https://cs50.harvard.edu/x/2026/weeks/3/",
    captions: makeCaptions([
      "알고리즘은 같은 문제를 얼마나 효율적으로 푸는지 비교하는 사고방식입니다.",
      "선형 탐색과 이진 탐색의 차이는 데이터가 정렬되어 있는지에서 시작합니다.",
      "정렬 알고리즘은 시간 복잡도와 구현 난이도의 trade-off를 보여줍니다.",
      "재귀는 큰 문제를 같은 모양의 작은 문제로 줄이는 강력한 패턴입니다.",
    ]),
  },
  {
    order: 5,
    title: "Week 4: Memory",
    videoId: "db0H0U13YsA",
    embedUrl: embed("db0H0U13YsA"),
    sourceUrl: source("db0H0U13YsA"),
    captionLanguage: "ko",
    captionLabel: "자체 한글 자막",
    cs50Url: "https://cs50.harvard.edu/x/2026/weeks/4/",
    captions: makeCaptions([
      "메모리는 주소를 가진 공간이고, 포인터는 그 주소를 값처럼 다루는 도구입니다.",
      "문자열과 배열을 메모리 관점에서 보면 복사와 참조의 차이가 분명해집니다.",
      "동적 할당은 필요한 만큼 메모리를 얻는 대신 직접 해제해야 하는 책임이 생깁니다.",
      "버퍼 오버플로와 누수는 C가 강력하지만 위험한 이유를 보여줍니다.",
    ]),
  },
  {
    order: 6,
    title: "Week 5: Data Structures",
    videoId: "PmAI76OGE_E",
    embedUrl: embed("PmAI76OGE_E"),
    sourceUrl: source("PmAI76OGE_E"),
    captionLanguage: "ko",
    captionLabel: "자체 한글 자막",
    cs50Url: "https://cs50.harvard.edu/x/2026/weeks/5/",
    captions: makeCaptions([
      "자료구조는 데이터를 어떤 모양으로 저장해야 작업이 쉬워지는지에 대한 선택입니다.",
      "연결 리스트는 크기 변경이 쉽지만 원하는 위치로 바로 이동하기 어렵습니다.",
      "해시 테이블은 좋은 해시 함수와 충돌 처리 전략이 성능을 좌우합니다.",
      "트라이는 문자열 검색에 특화된 구조로, 메모리와 속도의 trade-off가 있습니다.",
    ]),
  },
  {
    order: 7,
    title: "Week 6: Python",
    videoId: "Rl0ludWTLxs",
    embedUrl: embed("Rl0ludWTLxs"),
    sourceUrl: source("Rl0ludWTLxs"),
    captionLanguage: "ko",
    captionLabel: "자체 한글 자막",
    cs50Url: "https://cs50.harvard.edu/x/2026/weeks/6/",
    captions: makeCaptions([
      "Python은 C보다 많은 세부사항을 감춰서 문제 해결 자체에 더 집중하게 해줍니다.",
      "리스트, 딕셔너리, 문자열 메서드는 반복되는 작업을 짧고 명확하게 표현합니다.",
      "예외 처리와 라이브러리는 실제 프로그램을 더 견고하게 만드는 도구입니다.",
      "C에서 배운 메모리 감각을 갖고 Python을 보면 추상화의 장단점이 보입니다.",
    ]),
  },
  {
    order: 8,
    title: "Week 7: SQL",
    videoId: "oqRU2So6Z2Y",
    embedUrl: embed("oqRU2So6Z2Y"),
    sourceUrl: source("oqRU2So6Z2Y"),
    captionLanguage: "ko",
    captionLabel: "자체 한글 자막",
    cs50Url: "https://cs50.harvard.edu/x/2026/weeks/7/",
    captions: makeCaptions([
      "SQL은 데이터를 어떻게 저장했는지보다 어떤 결과가 필요한지를 선언적으로 표현합니다.",
      "SELECT, WHERE, JOIN을 조합하면 여러 테이블에 흩어진 정보를 연결할 수 있습니다.",
      "정규화는 중복을 줄이지만 조회가 복잡해질 수 있어 설계 균형이 필요합니다.",
      "인덱스는 조회를 빠르게 만들지만 쓰기 비용과 저장 공간을 함께 고려해야 합니다.",
    ]),
  },
  {
    order: 9,
    title: "Week 8: HTML, CSS, JavaScript",
    videoId: "yYst7puZXjw",
    embedUrl: embed("yYst7puZXjw"),
    sourceUrl: source("yYst7puZXjw"),
    captionLanguage: "ko",
    captionLabel: "자체 한글 자막",
    cs50Url: "https://cs50.harvard.edu/x/2026/weeks/8/",
    captions: makeCaptions([
      "HTML은 문서의 의미 구조, CSS는 표현, JavaScript는 상호작용을 담당합니다.",
      "웹 페이지는 브라우저가 DOM을 만들고 스타일과 스크립트를 적용하며 동작합니다.",
      "폼과 이벤트를 다루면 사용자의 입력을 받아 화면을 바꾸는 앱이 됩니다.",
      "프론트엔드에서도 접근성, 시맨틱, 상태 관리는 기본기입니다.",
    ]),
  },
  {
    order: 10,
    title: "Week 9: Flask",
    videoId: "am7POvSZ4GE",
    embedUrl: embed("am7POvSZ4GE"),
    sourceUrl: source("am7POvSZ4GE"),
    captionLanguage: "ko",
    captionLabel: "자체 한글 자막",
    cs50Url: "https://cs50.harvard.edu/x/2026/weeks/9/",
    captions: makeCaptions([
      "Flask는 요청을 받아 서버에서 처리하고 HTML이나 데이터를 응답하는 흐름을 보여줍니다.",
      "라우팅은 URL과 Python 함수를 연결하는 웹 서버의 기본 구조입니다.",
      "템플릿은 반복되는 HTML에 데이터를 끼워 넣어 동적인 페이지를 만듭니다.",
      "세션과 데이터베이스를 연결하면 실제 서비스에 가까운 웹 앱이 됩니다.",
    ]),
  },
  {
    order: 11,
    title: "Week 10: Cybersecurity",
    videoId: "ApQTgFkf8TU",
    embedUrl: embed("ApQTgFkf8TU"),
    sourceUrl: source("ApQTgFkf8TU"),
    captionLanguage: "ko",
    captionLabel: "자체 한글 자막",
    cs50Url: "https://cs50.harvard.edu/x/2026/weeks/10/",
    captions: makeCaptions([
      "보안은 기능을 만든 뒤 붙이는 장식이 아니라 설계 단계부터 고려해야 하는 조건입니다.",
      "비밀번호 저장, 암호화, 인증은 사용자의 신뢰와 직접 연결됩니다.",
      "피싱, 세션 탈취, SQL 인젝션은 실제 서비스에서 자주 문제가 되는 공격입니다.",
      "안전한 기본값과 입력 검증은 작은 프로젝트에서도 반드시 챙겨야 합니다.",
    ]),
  },
];

export const courseLessons: Record<string, CourseLesson[]> = {
  "harvard-cs50x": cs50Lessons,
};
