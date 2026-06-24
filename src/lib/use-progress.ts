"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "physics-platform-state-v1";
const THEME_KEY = "physics-platform-theme"; // يُدار عبر next-themes لكن نحتفظ بالمرجع

export type ProgressState = {
  studentName: string;
  completedLessons: string[]; // lesson IDs
  quizResults: Record<string, { correct: number; total: number }>; // lessonId -> result
  lastVisited: string | null; // lessonId
  startedAt: number | null;
  lessonTimeSeconds: Record<string, number>; // lessonId -> seconds spent
  totalTimeSeconds: number; // total time across all sessions
  certificateIssuedAt: number | null; // timestamp when certificate was first eligible
};

const DEFAULT_STATE: ProgressState = {
  studentName: "",
  completedLessons: [],
  quizResults: {},
  lastVisited: null,
  startedAt: null,
  lessonTimeSeconds: {},
  totalTimeSeconds: 0,
  certificateIssuedAt: null,
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

  // إضافة وقت للدرس + الإجمالي
  const addLessonTime = useCallback((lessonId: string, seconds: number) => {
    if (seconds <= 0) return;
    const cur = readFromStorage();
    const prevLessonTime = cur.lessonTimeSeconds[lessonId] || 0;
    const next: ProgressState = {
      ...cur,
      lessonTimeSeconds: {
        ...cur.lessonTimeSeconds,
        [lessonId]: prevLessonTime + seconds,
      },
      totalTimeSeconds: cur.totalTimeSeconds + seconds,
    };
    writeToStorage(next);
  }, []);

  const resetProgress = useCallback(() => {
    writeToStorage(DEFAULT_STATE);
  }, []);

  const logout = useCallback(() => {
    writeToStorage(DEFAULT_STATE);
  }, []);

  // إصدار شهادة عند إكمال المنهج (نُسجّل تاريخ الإصدار أول مرة)
  const issueCertificateIfEligible = useCallback(
    (totalLessons: number): { eligible: boolean; issued: boolean } => {
      const cur = readFromStorage();
      const completedCount = cur.completedLessons.length;
      const eligible = completedCount >= totalLessons && totalLessons > 0;
      if (eligible && !cur.certificateIssuedAt) {
        const next: ProgressState = { ...cur, certificateIssuedAt: Date.now() };
        writeToStorage(next);
        return { eligible: true, issued: true };
      }
      return { eligible, issued: false };
    },
    []
  );

  return {
    state,
    setStudentName,
    completeLesson,
    uncompleteLesson,
    setQuizResult,
    setLastVisited,
    addLessonTime,
    resetProgress,
    logout,
    issueCertificateIfEligible,
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

// تنسيق الثواني بصيغة "س:د:ث" أو "د:ث"
export function formatTime(totalSeconds: number): string {
  if (totalSeconds < 0) totalSeconds = 0;
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  if (h > 0) {
    return `${h} س ${m.toString().padStart(2, "0")} د ${s.toString().padStart(2, "0")} ث`;
  }
  if (m > 0) {
    return `${m} د ${s.toString().padStart(2, "0")} ث`;
  }
  return `${s} ث`;
}
