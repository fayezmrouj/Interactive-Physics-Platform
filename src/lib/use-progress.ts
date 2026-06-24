"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "physics-platform-state-v1";

export type ProgressState = {
  studentName: string;
  completedLessons: string[]; // lesson IDs
  quizResults: Record<string, { correct: number; total: number }>; // lessonId -> result
  lastVisited: string | null; // lessonId
  startedAt: number | null;
};

const DEFAULT_STATE: ProgressState = {
  studentName: "",
  completedLessons: [],
  quizResults: {},
  lastVisited: null,
  startedAt: null,
};

// Cache على مستوى الوحدة لتجنب القراءة المتكررة من localStorage
let cachedState: ProgressState | null = null;
let cachedRaw: string | null = null;

function readFromStorage(): ProgressState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw && cachedState) return cachedState;
    cachedRaw = raw;
    if (!raw) {
      cachedState = DEFAULT_STATE;
      return cachedState;
    }
    const parsed = JSON.parse(raw);
    cachedState = { ...DEFAULT_STATE, ...parsed };
    return cachedState;
  } catch {
    cachedState = DEFAULT_STATE;
    return cachedState;
  }
}

function writeToStorage(state: ProgressState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    cachedRaw = JSON.stringify(state);
    cachedState = state;
    window.dispatchEvent(new CustomEvent("physics-storage-change"));
  } catch (e) {
    console.error("Failed to write progress", e);
  }
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("physics-storage-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("physics-storage-change", callback);
    window.removeEventListener("storage", callback);
  };
}

export function useProgress() {
  // useSyncExternalStore يتولّى المزامنة مع localStorage ويتعامل مع SSR تلقائيًا
  const state = useSyncExternalStore(
    subscribe,
    readFromStorage, // client snapshot
    () => DEFAULT_STATE // server snapshot (ثابت لتجنّب hydration mismatch)
  );

  const setStudentName = useCallback((name: string) => {
    const next = { ...readFromStorage(), studentName: name, startedAt: Date.now() };
    writeToStorage(next);
  }, []);

  const completeLesson = useCallback((lessonId: string) => {
    const cur = readFromStorage();
    if (cur.completedLessons.includes(lessonId)) return;
    const next: ProgressState = {
      ...cur,
      completedLessons: [...cur.completedLessons, lessonId],
      lastVisited: lessonId,
    };
    writeToStorage(next);
  }, []);

  const uncompleteLesson = useCallback((lessonId: string) => {
    const cur = readFromStorage();
    const next: ProgressState = {
      ...cur,
      completedLessons: cur.completedLessons.filter((id) => id !== lessonId),
    };
    writeToStorage(next);
  }, []);

  const setQuizResult = useCallback(
    (lessonId: string, correct: number, total: number) => {
      const cur = readFromStorage();
      const prev = cur.quizResults[lessonId];
      // احتفظ بأفضل نتيجة فقط
      const best = prev && prev.correct > correct ? prev : { correct, total };
      const next: ProgressState = {
        ...cur,
        quizResults: { ...cur.quizResults, [lessonId]: best },
      };
      writeToStorage(next);
    },
    []
  );

  const setLastVisited = useCallback((lessonId: string) => {
    const cur = readFromStorage();
    const next: ProgressState = { ...cur, lastVisited: lessonId };
    writeToStorage(next);
  }, []);

  const resetProgress = useCallback(() => {
    writeToStorage(DEFAULT_STATE);
  }, []);

  const logout = useCallback(() => {
    writeToStorage(DEFAULT_STATE);
  }, []);

  return {
    state,
    setStudentName,
    completeLesson,
    uncompleteLesson,
    setQuizResult,
    setLastVisited,
    resetProgress,
    logout,
  };
}

// مرافق للتحقق إذا كان الكود يعمل على العميل (لمعالجة حالة الـ hydration الأولى)
export function useIsMounted(): boolean {
  // يستخدم useSyncExternalStore لتجنّب hydration mismatch
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
