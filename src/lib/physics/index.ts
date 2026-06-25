// الفهرس الرئيسي لمحتوى منصة الفيزياء
import type { Unit } from "./g9s1";
import { G9S1_UNITS } from "./g9s1";
import { G9S2_UNITS } from "./g9s2";
import { G10S1_UNITS } from "./g10s1";
import { G10S2_UNITS } from "./g10s2";

export type { Unit, Lesson, Formula, Concept, SolvedExample, Experiment, Misconception, QuizQuestion } from "./g9s1";

export const ALL_UNITS: Unit[] = [
  ...G9S1_UNITS,
  ...G9S2_UNITS,
  ...G10S1_UNITS,
  ...G10S2_UNITS,
];

// تجميع حسب الصف والفصل
export type CurriculumGroup = {
  grade: string;
  semester: string;
  units: Unit[];
};

export const CURRICULUM: CurriculumGroup[] = [
  {
    grade: "الصف التاسع",
    semester: "الفصل الأول",
    units: G9S1_UNITS,
  },
  {
    grade: "الصف التاسع",
    semester: "الفصل الثاني",
    units: G9S2_UNITS,
  },
  {
    grade: "الصف العاشر",
    semester: "الفصل الأول",
    units: G10S1_UNITS,
  },
  {
    grade: "الصف العاشر",
    semester: "الفصل الثاني",
    units: G10S2_UNITS,
  },
];

// إحصائيات المنهج
export const CURRICULUM_STATS = {
  totalUnits: ALL_UNITS.length,
  totalLessons: ALL_UNITS.reduce((acc, u) => acc + u.lessons.length, 0),
  totalLaws: ALL_UNITS.reduce(
    (acc, u) => acc + u.lessons.reduce((a, l) => a + l.formulas.length, 0),
    0
  ),
  totalExamples: ALL_UNITS.reduce(
    (acc, u) => acc + u.lessons.reduce((a, l) => a + l.examples.length, 0),
    0
  ),
  totalQuizzes: ALL_UNITS.reduce(
    (acc, u) => acc + u.lessons.reduce((a, l) => a + l.quiz.length, 0),
    0
  ),
};

// إيجاد درس بمعرّفه
export function findLesson(lessonId: string): { lesson: Unit["lessons"][0]; unit: Unit } | null {
  for (const unit of ALL_UNITS) {
    const lesson = unit.lessons.find((l) => l.id === lessonId);
    if (lesson) return { lesson, unit };
  }
  return null;
}

// قائمة معرّفات الدروس للترتيب
export const ALL_LESSON_IDS: string[] = ALL_UNITS.flatMap((u) => u.lessons.map((l) => l.id));

// دروس الصف التاسع فقط
export const GRADE9_LESSON_IDS: string[] = ALL_UNITS
  .filter((u) => u.grade.includes("التاسع"))
  .flatMap((u) => u.lessons.map((l) => l.id));

// دروس الصف العاشر فقط
export const GRADE10_LESSON_IDS: string[] = ALL_UNITS
  .filter((u) => u.grade.includes("العاشر"))
  .flatMap((u) => u.lessons.map((l) => l.id));

// إحصائيات كل صف
export const GRADE9_LESSONS_COUNT = GRADE9_LESSON_IDS.length;
export const GRADE10_LESSONS_COUNT = GRADE10_LESSON_IDS.length;
