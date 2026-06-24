// قاموس المصطلحات الفيزيائية
// يجمع كل المفاهيم من جميع الدروس في مكان واحد قابل للبحث

import { ALL_UNITS } from "./index";
import type { Concept } from "./g9s1";

export type DictEntry = Concept & {
  lessonId: string;
  lessonTitle: string;
  unitTitle: string;
  grade: string;
};

let cachedDict: DictEntry[] | null = null;

export function getDictionary(): DictEntry[] {
  if (cachedDict) return cachedDict;
  const entries: DictEntry[] = [];
  for (const unit of ALL_UNITS) {
    for (const lesson of unit.lessons) {
      for (const concept of lesson.concepts) {
        entries.push({
          ...concept,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          unitTitle: unit.title,
          grade: unit.grade,
        });
      }
    }
  }
  cachedDict = entries;
  return entries;
}

// بنك قوانين قابل للبحث
export type FormulaEntry = {
  name: string;
  expression: string;
  description: string;
  lessonId: string;
  lessonTitle: string;
  unitTitle: string;
};

let cachedFormulas: FormulaEntry[] | null = null;

export function getFormulaBank(): FormulaEntry[] {
  if (cachedFormulas) return cachedFormulas;
  const entries: FormulaEntry[] = [];
  for (const unit of ALL_UNITS) {
    for (const lesson of unit.lessons) {
      for (const f of lesson.formulas) {
        entries.push({
          ...f,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          unitTitle: unit.title,
        });
      }
    }
  }
  cachedFormulas = entries;
  return entries;
}

// بحث شامل في القاموس + القوانين + الدروس
export type SearchResult = {
  type: "lesson" | "concept" | "formula";
  id: string;
  title: string;
  subtitle: string;
  snippet: string;
  lessonId?: string; // للتنقل المباشر
};

export function searchAll(query: string): SearchResult[] {
  if (!query || query.trim().length < 1) return [];
  const q = query.trim().toLowerCase();
  const results: SearchResult[] = [];

  // بحث في الدروس
  for (const unit of ALL_UNITS) {
    for (const lesson of unit.lessons) {
      const matchesTitle = lesson.title.toLowerCase().includes(q);
      const matchesIdea = lesson.mainIdea.toLowerCase().includes(q);
      const matchesExplanation = lesson.explanation.some((p) =>
        p.toLowerCase().includes(q)
      );
      if (matchesTitle || matchesIdea || matchesExplanation) {
        results.push({
          type: "lesson",
          id: lesson.id,
          title: lesson.title,
          subtitle: `${unit.grade} • ${unit.title}`,
          snippet: matchesTitle
            ? lesson.mainIdea.slice(0, 120)
            : lesson.explanation.find((p) =>
                p.toLowerCase().includes(q)
              )?.slice(0, 120) || lesson.mainIdea.slice(0, 120),
          lessonId: lesson.id,
        });
      }
    }
  }

  // بحث في المفاهيم
  for (const entry of getDictionary()) {
    if (
      entry.term.toLowerCase().includes(q) ||
      entry.definition.toLowerCase().includes(q)
    ) {
      results.push({
        type: "concept",
        id: `concept-${entry.lessonId}-${entry.term}`,
        title: entry.term,
        subtitle: `${entry.grade} • ${entry.unitTitle} • ${entry.lessonTitle}`,
        snippet: entry.definition.slice(0, 150),
        lessonId: entry.lessonId,
      });
    }
  }

  // بحث في القوانين
  for (const f of getFormulaBank()) {
    if (
      f.name.toLowerCase().includes(q) ||
      f.expression.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q)
    ) {
      results.push({
        type: "formula",
        id: `formula-${f.lessonId}-${f.name}`,
        title: f.name,
        subtitle: `${f.unitTitle} • ${f.lessonTitle}`,
        snippet: `${f.expression} — ${f.description.slice(0, 100)}`,
        lessonId: f.lessonId,
      });
    }
  }

  return results.slice(0, 30);
}
