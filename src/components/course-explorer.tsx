"use client";

import { useMemo, useState } from "react";
import { CourseCard } from "@/components/course-card";
import { filterCourses, getUniqueInstitutions, getUniqueTopics } from "@/lib/catalog";
import type { Course, CourseDifficulty, KoreanFriendliness } from "@/types/course";

type DifficultyFilter = CourseDifficulty | "all";
type FriendlinessFilter = KoreanFriendliness | "all";

export function CourseExplorer({ courses }: { courses: Course[] }) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [topic, setTopic] = useState("all");
  const [institution, setInstitution] = useState("all");
  const [friendliness, setFriendliness] = useState<FriendlinessFilter>("all");

  const topics = useMemo(() => getUniqueTopics(courses), [courses]);
  const institutions = useMemo(() => getUniqueInstitutions(courses), [courses]);
  const filtered = filterCourses(courses, { query, difficulty, topic, institution, koreanFriendliness: friendliness });

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="CS50, 알고리즘, MIT, AI처럼 검색"
          className="mb-3 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400"
        />
        <div className="grid gap-3 md:grid-cols-4">
          <select value={difficulty} onChange={(event) => setDifficulty(event.target.value as DifficultyFilter)} className="rounded-2xl border border-slate-200 px-3 py-3 text-sm">
            <option value="all">전체 난이도</option><option value="intro">입문</option><option value="beginner">초급</option><option value="intermediate">중급</option><option value="advanced">고급</option>
          </select>
          <select value={topic} onChange={(event) => setTopic(event.target.value)} className="rounded-2xl border border-slate-200 px-3 py-3 text-sm">
            <option value="all">전체 분야</option>{topics.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select value={institution} onChange={(event) => setInstitution(event.target.value)} className="rounded-2xl border border-slate-200 px-3 py-3 text-sm">
            <option value="all">전체 기관</option>{institutions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select value={friendliness} onChange={(event) => setFriendliness(event.target.value as FriendlinessFilter)} className="rounded-2xl border border-slate-200 px-3 py-3 text-sm">
            <option value="all">한국어 친화도 전체</option><option value="high">높음</option><option value="medium">보통</option><option value="low">낮음</option>
          </select>
        </div>
      </div>
      <p className="text-sm font-semibold text-slate-600">총 {filtered.length}개 강의</p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((course) => <CourseCard key={course.slug} course={course} />)}
      </div>
    </section>
  );
}
