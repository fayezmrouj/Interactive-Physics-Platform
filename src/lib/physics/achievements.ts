// تعريفات الإنجازات والشارات في منصة الفيزياء التفاعلية

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji
  category: "lessons" | "quiz" | "streak" | "time" | "special";
  // شرط الإنجاز - يُفحص يدويًا في الـ hook
  check: (state: AchievementCheckState) => boolean;
  points: number;
};

export type AchievementCheckState = {
  completedLessons: string[];
  quizResults: Record<string, { correct: number; total: number }>;
  totalTimeSeconds: number;
  dailyStreak: number;
  dailyChallengeCompletedDates: string[];
  perfectQuizzes: number; // عدد الكويزات 100%
  unitsCompleted: number;
  lastThemeMode: "light" | "dark" | null;
};

export const ACHIEVEMENTS: Achievement[] = [
  // إنجازات الدروس
  {
    id: "first-lesson",
    title: "الخطوة الأولى",
    description: "أكملت أول درس لك",
    icon: "🎯",
    category: "lessons",
    points: 10,
    check: (s) => s.completedLessons.length >= 1,
  },
  {
    id: "five-lessons",
    title: "متعلم نشيط",
    description: "أكملت 5 دروس",
    icon: "📚",
    category: "lessons",
    points: 25,
    check: (s) => s.completedLessons.length >= 5,
  },
  {
    id: "ten-lessons",
    title: "نصف الطريق",
    description: "أكملت 10 دروس",
    icon: "🏔️",
    category: "lessons",
    points: 50,
    check: (s) => s.completedLessons.length >= 10,
  },
  {
    id: "first-unit",
    title: "بطل الوحدة",
    description: "أكملت وحدة كاملة",
    icon: "🏅",
    category: "lessons",
    points: 30,
    check: (s) => s.unitsCompleted >= 1,
  },
  {
    id: "all-lessons",
    title: "إتقان المنهج",
    description: "أكملت جميع الدروس (24 درسًا)",
    icon: "👑",
    category: "lessons",
    points: 200,
    check: (s) => s.completedLessons.length >= 24,
  },

  // إنجازات الكويز
  {
    id: "first-quiz",
    title: "أول اختبار",
    description: "أكملت أول كويز",
    icon: "✏️",
    category: "quiz",
    points: 10,
    check: (s) => Object.keys(s.quizResults).length >= 1,
  },
  {
    id: "perfect-quiz",
    title: "بلا أخطاء",
    description: "أجبت كويزًا بنسبة 100%",
    icon: "💯",
    category: "quiz",
    points: 25,
    check: (s) => s.perfectQuizzes >= 1,
  },
  {
    id: "five-perfect",
    title: "محترف الكويزات",
    description: "أجبت 5 كويزات بنسبة 100%",
    icon: "⭐",
    category: "quiz",
    points: 75,
    check: (s) => s.perfectQuizzes >= 5,
  },

  // إنجازات السلسلة (Streak)
  {
    id: "streak-3",
    title: "ثلاثة أيام",
    description: "درست 3 أيام متتالية",
    icon: "🔥",
    category: "streak",
    points: 30,
    check: (s) => s.dailyStreak >= 3,
  },
  {
    id: "streak-7",
    title: "أسبوع كامل",
    description: "درست 7 أيام متتالية",
    icon: "📅",
    category: "streak",
    points: 75,
    check: (s) => s.dailyStreak >= 7,
  },
  {
    id: "streak-30",
    title: "شهر الإتقان",
    description: "درست 30 يومًا متتالية",
    icon: "🏆",
    category: "streak",
    points: 300,
    check: (s) => s.dailyStreak >= 30,
  },

  // إنجازات الوقت
  {
    id: "time-1h",
    title: "ساعة دراسة",
    description: "درست ساعة كاملة (3600 ثانية)",
    icon: "⏱️",
    category: "time",
    points: 30,
    check: (s) => s.totalTimeSeconds >= 3600,
  },
  {
    id: "time-5h",
    title: "خمس ساعات",
    description: "درست 5 ساعات (18000 ثانية)",
    icon: "⌛",
    category: "time",
    points: 100,
    check: (s) => s.totalTimeSeconds >= 18000,
  },
  {
    id: "time-10h",
    title: "عاشق الفيزياء",
    description: "درست 10 ساعات (36000 ثانية)",
    icon: "🌌",
    category: "time",
    points: 200,
    check: (s) => s.totalTimeSeconds >= 36000,
  },

  // إنجازات التحدي اليومي
  {
    id: "daily-1",
    title: "تحدي اليوم",
    description: "أكملت تحدي اليوم الأول",
    icon: "🎲",
    category: "special",
    points: 15,
    check: (s) => s.dailyChallengeCompletedDates.length >= 1,
  },
  {
    id: "daily-7",
    title: "أسبوع تحديات",
    description: "أكملت 7 تحديات يومية",
    icon: "⚔️",
    category: "special",
    points: 75,
    check: (s) => s.dailyChallengeCompletedDates.length >= 7,
  },
  {
    id: "daily-30",
    title: "بطل التحديات",
    description: "أكملت 30 تحديًا يوميًا",
    icon: "🛡️",
    category: "special",
    points: 250,
    check: (s) => s.dailyChallengeCompletedDates.length >= 30,
  },

  // إنجازات خاصة
  {
    id: "night-owl",
    title: "البومة الليلية",
    description: "درست في الوضع الليلي",
    icon: "🌙",
    category: "special",
    points: 10,
    check: (s) => s.lastThemeMode === "dark",
  },
  {
    id: "all-units",
    title: "صاحب المنهج",
    description: "أكملت جميع الوحدات (10 وحدات)",
    icon: "💎",
    category: "lessons",
    points: 150,
    check: (s) => s.unitsCompleted >= 10,
  },
];

export const ACHIEVEMENT_CATEGORIES = [
  { id: "lessons", title: "الدروس", icon: "📚" },
  { id: "quiz", title: "الكويزات", icon: "✏️" },
  { id: "streak", title: "السلاسل", icon: "🔥" },
  { id: "time", title: "الوقت", icon: "⏱️" },
  { id: "special", title: "خاصة", icon: "⭐" },
] as const;

export function computeUnlockedAchievements(
  state: AchievementCheckState
): string[] {
  return ACHIEVEMENTS.filter((a) => a.check(state)).map((a) => a.id);
}

export function computeAchievementPoints(unlocked: string[]): number {
  return ACHIEVEMENTS.filter((a) => unlocked.includes(a.id)).reduce(
    (acc, a) => acc + a.points,
    0
  );
}
