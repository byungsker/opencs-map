import type { Roadmap } from "@/types/roadmap";

export const roadmaps: Roadmap[] = [
  {
    slug: "non-cs-beginner",
    title: "비전공자 CS 입문",
    description: "처음 CS를 공부하는 사람이 큰 그림과 기본 구현 감각을 만드는 로드맵입니다.",
    targetAudience: ["비전공자", "개발 입문자", "CS 첫 학습자"],
    estimatedMonths: 6,
    steps: [
      { order: 1, courseSlug: "harvard-cs50x", reason: "CS 전체 지도를 먼저 잡습니다." },
      { order: 2, courseSlug: "nand2tetris-part1", reason: "컴퓨터가 밑바닥에서 어떻게 구성되는지 직접 만듭니다." },
      { order: 3, courseSlug: "berkeley-cs61a", reason: "프로그래밍 추상화와 사고력을 키웁니다." },
      { order: 4, courseSlug: "mit-6006-algorithms", reason: "자료구조와 알고리즘의 기본 뼈대를 세웁니다." },
    ],
  },
  {
    slug: "junior-foundation",
    title: "주니어 개발자 기본기 강화",
    description: "실무는 하지만 시스템, 네트워크, DB, 알고리즘 기초를 보강하고 싶은 개발자용입니다.",
    targetAudience: ["주니어 개발자", "백엔드 개발자", "기본기 보강"],
    estimatedMonths: 9,
    steps: [
      { order: 1, courseSlug: "mit-missing-semester", reason: "개발 도구 생산성을 먼저 올립니다." },
      { order: 2, courseSlug: "berkeley-cs61b", reason: "자료구조와 대형 과제 구현 체력을 만듭니다." },
      { order: 3, courseSlug: "cmu-15213-csapp", reason: "시스템 해상도를 높입니다." },
      { order: 4, courseSlug: "stanford-cs144-networking", reason: "인터넷과 TCP/IP의 작동 원리를 이해합니다." },
      { order: 5, courseSlug: "cmu-15445-database", reason: "DBMS 내부 구조를 배웁니다." },
    ],
  },
  {
    slug: "ai-engineer-track",
    title: "AI 엔지니어 준비",
    description: "개발자가 AI/ML 엔지니어링으로 넘어가기 위해 수학, ML, 딥러닝을 쌓는 경로입니다.",
    targetAudience: ["AI 엔지니어 지망생", "LLM 시대 개발자", "ML 입문자"],
    estimatedMonths: 8,
    steps: [
      { order: 1, courseSlug: "mit-60001-python", reason: "Python과 계산적 사고 기초를 확인합니다." },
      { order: 2, courseSlug: "3b1b-linear-algebra", reason: "선형대수 직관을 먼저 만듭니다." },
      { order: 3, courseSlug: "mit-linear-algebra", reason: "선형대수 이론 기반을 보강합니다.", optional: true },
      { order: 4, courseSlug: "khan-probability-statistics", reason: "확률과 통계 빈칸을 메웁니다." },
      { order: 5, courseSlug: "fastai-practical-deep-learning", reason: "딥러닝을 실전 관점에서 먼저 경험합니다." },
      { order: 6, courseSlug: "stanford-cs229", reason: "ML 원리를 수학적으로 정리합니다." },
      { order: 7, courseSlug: "stanford-cs224n", reason: "NLP와 LLM 이전 기초를 다집니다.", optional: true },
    ],
  },
];
