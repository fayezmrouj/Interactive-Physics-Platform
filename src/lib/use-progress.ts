"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  computeUnlockedAchievements,
  type AchievementCheckState,
} from "./physics/achievements";
import { ALL_UNITS } from "./physics";
import { getTodayKey, getDailyChallenge } from "./physics/practice-questions";

const STORAGE_KEY = "physics-platform-state-v1";

// ====== الأنواع ======

export type SpacedRepetitionItem = {
  questionId: string;
  // صندوق المراجعة: 1=جديد، 2=بعد يوم، 3=بعد 3 أيام، 4=بعد أسبوع، 5=بعد شهر
  box: 1 | 2 | 3 | 4 | 5;
  nextReviewAt: number; // timestamp
  lastAnsweredAt: number | null;
  correctCount: number;
  wrongCount: number;
};

export type UserProfile = {
  id: string;
  name: string;
  createdAt: number;
  // الصف المختار: "9" أو "10" أو "all" (الكل)
  grade: "9" | "10" | "all";
  // حالة كل ملف
  completedLessons: string[];
  quizResults: Record<string, { correct: number; total: number }>;
  lastVisited: string | null;
  startedAt: number | null;
  lessonTimeSeconds: Record<string, number>;
  totalTimeSeconds: number;
  certificateIssuedAt: number | null;
  certificateIssuedAt9: number | null;
  certificateIssuedAt10: number | null;
  // مفكرة الطالب: lessonId -> نص
  notebook: Record<string, string>;
  // مراجعة ذكية
  spacedRepetition: Record<string, SpacedRepetitionItem>;
  // التحدي اليومي
  dailyChallengeCompletedDates: string[];
  dailyChallengeResults: Record<string, { correct: boolean; date: string }>;
  // التدريب المكثّف
  practiceStats: {
    totalAnswered: number;
    totalCorrect: number;
    byDifficulty: { easy: { c: number; t: number }; medium: { c: number; t: number }; hard: { c: number; t: number } };
  };
  // آخر سلسلة (streak)
  lastStudyDate: string | null;
  dailyStreak: number;
  // الإنجازات
  unlockedAchievements: string[];
  // آخر وضع لوني
  lastThemeMode: "light" | "dark" | null;
};

export type ProgressState = {
  // دعم متعدد المستخدمين
  profiles: Record<string, UserProfile>;
  activeProfileId: string | null;
};

const createDefaultProfile = (id: string, name: string, grade: "9" | "10" | "all" = "all"): UserProfile => ({
  id,
  name,
  createdAt: Date.now(),
  grade,
  completedLessons: [],
  quizResults: {},
  lastVisited: null,
  startedAt: Date.now(),
  lessonTimeSeconds: {},
  totalTimeSeconds: 0,
  certificateIssuedAt: null,
  certificateIssuedAt9: null,
  certificateIssuedAt10: null,
  notebook: {},
  spacedRepetition: {},
  dailyChallengeCompletedDates: [],
  dailyChallengeResults: {},
  practiceStats: {
    totalAnswered: 0,
    totalCorrect: 0,
    byDifficulty: {
      easy: { c: 0, t: 0 },
      medium: { c: 0, t: 0 },
      hard: { c: 0, t: 0 },
    },
  },
  lastStudyDate: null,
  dailyStreak: 0,
  unlockedAchievements: [],
  lastThemeMode: null,
});

const DEFAULT_STATE: ProgressState = {
  profiles: {},
  activeProfileId: null,
};

// ====== Cache على مستوى الوحدة ======

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
    // Migration: إذا كانت البنية قديمة (فيها studentName بدلاً من profiles)
    if (parsed.studentName && !parsed.profiles) {
      const profile = createDefaultProfile("user-1", parsed.studentName);
      profile.completedLessons = parsed.completedLessons || [];
      profile.quizResults = parsed.quizResults || {};
      profile.lastVisited = parsed.lastVisited || null;
      profile.startedAt = parsed.startedAt || Date.now();
      profile.lessonTimeSeconds = parsed.lessonTimeSeconds || {};
      profile.totalTimeSeconds = parsed.totalTimeSeconds || 0;
      profile.certificateIssuedAt = parsed.certificateIssuedAt || null;
      cachedState = { profiles: { "user-1": profile }, activeProfileId: "user-1" };
      // اكتب النسخة المهاجرة فورًا
      writeToStorage(cachedState);
      return cachedState;
    }
    cachedState = { ...DEFAULT_STATE, ...parsed };
    // Migration: ضمان وجود grade في كل profile قديم
    let migrated = false;
    for (const id of Object.keys(cachedState.profiles || {})) {
      if (!cachedState.profiles[id].grade) {
        cachedState.profiles[id].grade = "all";
        migrated = true;
      }
    }
    if (migrated) {
      writeToStorage(cachedState);
    }
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

// ====== Helper: احصل على الملف النشط ======

function getActiveProfile(state: ProgressState): UserProfile | null {
  if (!state.activeProfileId) return null;
  return state.profiles[state.activeProfileId] || null;
}

function updateActiveProfile(
  state: ProgressState,
  updater: (p: UserProfile) => UserProfile
): ProgressState {
  if (!state.activeProfileId) return state;
  const cur = state.profiles[state.activeProfileId];
  if (!cur) return state;
  const updated = updater({ ...cur });
  // تحديث الإنجازات تلقائيًا
  const achState: AchievementCheckState = {
    completedLessons: updated.completedLessons,
    quizResults: updated.quizResults,
    totalTimeSeconds: updated.totalTimeSeconds,
    dailyStreak: updated.dailyStreak,
    dailyChallengeCompletedDates: updated.dailyChallengeCompletedDates,
    perfectQuizzes: Object.values(updated.quizResults).filter(
      (r) => r.correct === r.total
    ).length,
    unitsCompleted: ALL_UNITS.filter((u) =>
      u.lessons.every((l) => updated.completedLessons.includes(l.id))
    ).length,
    lastThemeMode: updated.lastThemeMode,
  };
  const newAchievements = computeUnlockedAchievements(achState);
  const newlyUnlocked = newAchievements.filter(
    (id) => !updated.unlockedAchievements.includes(id)
  );
  updated.unlockedAchievements = newAchievements;

  // إذا فُتحت إنجازات جديدة، أطلق حدثًا
  if (newlyUnlocked.length > 0 && typeof window !== "undefined") {
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("physics-achievements-unlocked", {
          detail: newlyUnlocked,
        })
      );
    }, 0);
  }

  return {
    ...state,
    profiles: { ...state.profiles, [state.activeProfileId]: updated },
  };
}

// ====== Hook الرئيسي ======

export function useProgress() {
  const state = useSyncExternalStore(
    subscribe,
    readFromStorage,
    () => DEFAULT_STATE
  );

  const activeProfile = getActiveProfile(state);

  // === إدارة المستخدمين ===
  const setStudentName = useCallback(
    (name: string, grade: "9" | "10" | "all" = "all") => {
      const cur = readFromStorage();
      const id = `user-${Date.now()}`;
      const profile = createDefaultProfile(id, name, grade);
      writeToStorage({
        profiles: { ...cur.profiles, [id]: profile },
        activeProfileId: id,
      });
    },
    []
  );

  const switchProfile = useCallback((profileId: string) => {
    const cur = readFromStorage();
    if (!cur.profiles[profileId]) return;
    writeToStorage({ ...cur, activeProfileId: profileId });
  }, []);

  const addProfile = useCallback(
    (name: string, grade: "9" | "10" | "all" = "all") => {
      const cur = readFromStorage();
      const id = `user-${Date.now()}`;
      const profile = createDefaultProfile(id, name, grade);
      writeToStorage({
        profiles: { ...cur.profiles, [id]: profile },
        activeProfileId: id,
      });
    },
    []
  );

  const setProfileGrade = useCallback(
    (grade: "9" | "10" | "all") => {
      const cur = readFromStorage();
      const next = updateActiveProfile(cur, (p) => ({ ...p, grade }));
      writeToStorage(next);
    },
    []
  );

  const deleteProfile = useCallback((profileId: string) => {
    const cur = readFromStorage();
    if (Object.keys(cur.profiles).length <= 1) return; // لا تحذف آخر ملف
    const newProfiles = { ...cur.profiles };
    delete newProfiles[profileId];
    writeToStorage({
      profiles: newProfiles,
      activeProfileId:
        cur.activeProfileId === profileId
          ? Object.keys(newProfiles)[0]
          : cur.activeProfileId,
    });
  }, []);

  // === الدروس ===
  const completeLesson = useCallback((lessonId: string) => {
    const cur = readFromStorage();
    const next = updateActiveProfile(cur, (p) => {
      if (p.completedLessons.includes(lessonId)) return p;
      const todayKey = getTodayKey();
      const newStreak =
        p.lastStudyDate === todayKey
          ? p.dailyStreak
          : p.lastStudyDate === yesterdayKey()
          ? p.dailyStreak + 1
          : 1;
      return {
        ...p,
        completedLessons: [...p.completedLessons, lessonId],
        lastVisited: lessonId,
        lastStudyDate: todayKey,
        dailyStreak: newStreak,
      };
    });
    writeToStorage(next);
  }, []);

  const uncompleteLesson = useCallback((lessonId: string) => {
    const cur = readFromStorage();
    const next = updateActiveProfile(cur, (p) => ({
      ...p,
      completedLessons: p.completedLessons.filter((id) => id !== lessonId),
    }));
    writeToStorage(next);
  }, []);

  const setQuizResult = useCallback(
    (lessonId: string, correct: number, total: number) => {
      const cur = readFromStorage();
      const next = updateActiveProfile(cur, (p) => {
        const prev = p.quizResults[lessonId];
        const best = prev && prev.correct > correct ? prev : { correct, total };
        return {
          ...p,
          quizResults: { ...p.quizResults, [lessonId]: best },
        };
      });
      writeToStorage(next);
    },
    []
  );

  const setLastVisited = useCallback((lessonId: string) => {
    const cur = readFromStorage();
    const next = updateActiveProfile(cur, (p) => ({
      ...p,
      lastVisited: lessonId,
    }));
    writeToStorage(next);
  }, []);

  // === تتبع الوقت ===
  const addLessonTime = useCallback((lessonId: string, seconds: number) => {
    if (seconds <= 0) return;
    const cur = readFromStorage();
    const next = updateActiveProfile(cur, (p) => {
      const prevTime = p.lessonTimeSeconds[lessonId] || 0;
      const todayKey = getTodayKey();
      const newStreak =
        p.lastStudyDate === todayKey
          ? p.dailyStreak
          : p.lastStudyDate === yesterdayKey()
          ? p.dailyStreak + 1
          : 1;
      return {
        ...p,
        lessonTimeSeconds: {
          ...p.lessonTimeSeconds,
          [lessonId]: prevTime + seconds,
        },
        totalTimeSeconds: p.totalTimeSeconds + seconds,
        lastStudyDate: todayKey,
        dailyStreak: newStreak,
      };
    });
    writeToStorage(next);
  }, []);

  // === المفكرة ===
  const setNotebookEntry = useCallback((lessonId: string, text: string) => {
    const cur = readFromStorage();
    const next = updateActiveProfile(cur, (p) => ({
      ...p,
      notebook: { ...p.notebook, [lessonId]: text },
    }));
    writeToStorage(next);
  }, []);

  // === التحدي اليومي ===
  const completeDailyChallenge = useCallback(
    (correct: boolean) => {
      const cur = readFromStorage();
      const todayKey = getTodayKey();
      const next = updateActiveProfile(cur, (p) => {
        if (p.dailyChallengeCompletedDates.includes(todayKey)) return p;
        return {
          ...p,
          dailyChallengeCompletedDates: [
            ...p.dailyChallengeCompletedDates,
            todayKey,
          ],
          dailyChallengeResults: {
            ...p.dailyChallengeResults,
            [todayKey]: { correct, date: todayKey },
          },
        };
      });
      writeToStorage(next);
    },
    []
  );

  // === التدريب المكثّف ===
  const recordPracticeAnswer = useCallback(
    (
      questionId: string,
      isCorrect: boolean,
      difficulty: "easy" | "medium" | "hard"
    ) => {
      const cur = readFromStorage();
      const next = updateActiveProfile(cur, (p) => {
        const d = p.practiceStats.byDifficulty[difficulty];
        const newStats = {
          totalAnswered: p.practiceStats.totalAnswered + 1,
          totalCorrect: p.practiceStats.totalCorrect + (isCorrect ? 1 : 0),
          byDifficulty: {
            ...p.practiceStats.byDifficulty,
            [difficulty]: {
              c: d.c + (isCorrect ? 1 : 0),
              t: d.t + 1,
            },
          },
        };
        // تحديث صندوق المراجعة الذكية
        const prev = p.spacedRepetition[questionId];
        const box = prev?.box || 1;
        const newBox = isCorrect
          ? Math.min(5, box + 1) as 1 | 2 | 3 | 4 | 5
          : 1;
        const daysUntilNext = [0, 1, 3, 7, 30][newBox - 1];
        const nextReviewAt = Date.now() + daysUntilNext * 86400000;
        return {
          ...p,
          practiceStats: newStats,
          spacedRepetition: {
            ...p.spacedRepetition,
            [questionId]: {
              questionId,
              box: newBox,
              nextReviewAt,
              lastAnsweredAt: Date.now(),
              correctCount: (prev?.correctCount || 0) + (isCorrect ? 1 : 0),
              wrongCount: (prev?.wrongCount || 0) + (isCorrect ? 0 : 1),
            },
          },
        };
      });
      writeToStorage(next);
    },
    []
  );

  // === الإنجازات ===
  const unlockThemeAchievement = useCallback(
    (mode: "light" | "dark") => {
      const cur = readFromStorage();
      const next = updateActiveProfile(cur, (p) => ({
        ...p,
        lastThemeMode: mode,
      }));
      writeToStorage(next);
    },
    []
  );

  // === إدارة عامة ===
  const resetProgress = useCallback(() => {
    const cur = readFromStorage();
    if (!cur.activeProfileId) return;
    const oldProfile = cur.profiles[cur.activeProfileId];
    const newProfile = createDefaultProfile(
      cur.activeProfileId,
      oldProfile.name,
      oldProfile.grade || "all"
    );
    writeToStorage({
      ...cur,
      profiles: { ...cur.profiles, [cur.activeProfileId]: newProfile },
    });
  }, []);

  const logout = useCallback(() => {
    writeToStorage(DEFAULT_STATE);
  }, []);

  const issueCertificateIfEligible = useCallback(
    (totalLessons: number): { eligible: boolean; issued: boolean } => {
      const cur = readFromStorage();
      if (!cur.activeProfileId) return { eligible: false, issued: false };
      const p = cur.profiles[cur.activeProfileId];
      const eligible = p.completedLessons.length >= totalLessons && totalLessons > 0;
      if (eligible && !p.certificateIssuedAt) {
        const next = updateActiveProfile(cur, (pp) => ({
          ...pp,
          certificateIssuedAt: Date.now(),
        }));
        writeToStorage(next);
        return { eligible: true, issued: true };
      }
      return { eligible, issued: false };
    },
    []
  );

  // إصدار شهادة لصف محدد (9 أو 10) عند إكمال 100% من دروسه
  const issueGradeCertificate = useCallback(
    (grade: 9 | 10, gradeLessonIds: string[]): { eligible: boolean; issued: boolean } => {
      const cur = readFromStorage();
      if (!cur.activeProfileId) return { eligible: false, issued: false };
      const p = cur.profiles[cur.activeProfileId];
      // تحقق أن جميع دروس الصف مكتملة
      const allCompleted = gradeLessonIds.every((id) => p.completedLessons.includes(id));
      const field = grade === 9 ? "certificateIssuedAt9" : "certificateIssuedAt10";
      if (allCompleted && !p[field]) {
        const next = updateActiveProfile(cur, (pp) => ({
          ...pp,
          [field]: Date.now(),
        }));
        writeToStorage(next);
        return { eligible: true, issued: true };
      }
      return { eligible: allCompleted, issued: false };
    },
    []
  );

  // === تصدير/استيراد ===
  const exportState = useCallback((): string => {
    return JSON.stringify(readFromStorage(), null, 2);
  }, []);

  const importState = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      if (!parsed.profiles || !parsed.activeProfileId) return false;
      writeToStorage(parsed);
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    state,
    activeProfile,
    // إدارة المستخدمين
    setStudentName,
    switchProfile,
    addProfile,
    deleteProfile,
    setProfileGrade,
    // الدروس
    completeLesson,
    uncompleteLesson,
    setQuizResult,
    setLastVisited,
    // الوقت
    addLessonTime,
    // المفكرة
    setNotebookEntry,
    // التحدي اليومي
    completeDailyChallenge,
    // التدريب
    recordPracticeAnswer,
    // الإنجازات
    unlockThemeAchievement,
    // عام
    resetProgress,
    logout,
    issueCertificateIfEligible,
    issueGradeCertificate,
    // تصدير/استيراد
    exportState,
    importState,
  };
}

function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getTodayKey(d);
}

// مرافق
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

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
